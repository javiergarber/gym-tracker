import * as SQLite from "expo-sqlite"
import type { ParsedCSV } from "./csv-parser"
import type { Workout, Day, ExerciseWithSets, WorkoutSession, SessionSet } from "@/constants/types"

let db: SQLite.SQLiteDatabase | null = null
let dbListeners: Set<() => void> = new Set()

export function getDb() {
  return db
}

export function subscribeToDb(callback: () => void) {
  dbListeners.add(callback)
  return () => dbListeners.delete(callback)
}

function notifyDbReady() {
  dbListeners.forEach((cb) => cb())
}

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync("gym-tracker.db")

  await db.execAsync("PRAGMA foreign_keys = ON")

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS days (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      subtitle TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      series TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      set_number INTEGER NOT NULL,
      reps TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_id INTEGER NOT NULL,
      started_at TEXT DEFAULT (datetime('now')),
      ended_at TEXT,
      completed INTEGER DEFAULT 0,
      FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS session_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      set_index INTEGER NOT NULL,
      weight REAL NOT NULL,
      rir_label TEXT NOT NULL,
      logged_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );
  `)

  notifyDbReady()
}

function parseSeriesCount(seriesStr: string): number {
  const match = seriesStr.match(/^\d+/)
  if (match) return parseInt(match[0], 10)
  return 1
}

export async function importWorkout(name: string, data: ParsedCSV): Promise<number> {
  if (!db) throw new Error("Database not initialized")

  const workoutResult = await db.runAsync(
    "INSERT INTO workouts (name) VALUES (?)",
    name
  )
  const workoutId = workoutResult.lastInsertRowId

  for (let dayIdx = 0; dayIdx < data.days.length; dayIdx++) {
    const day = data.days[dayIdx]
    if (day.exercises.length === 0) continue

    const dayResult = await db.runAsync(
      "INSERT INTO days (workout_id, name, subtitle, sort_order) VALUES (?, ?, ?, ?)",
      workoutId,
      day.name,
      day.subtitle,
      dayIdx
    )
    const dayId = dayResult.lastInsertRowId

    for (let exIdx = 0; exIdx < day.exercises.length; exIdx++) {
      const ex = day.exercises[exIdx]

      const exResult = await db.runAsync(
        "INSERT INTO exercises (day_id, name, series, sort_order) VALUES (?, ?, ?, ?)",
        dayId,
        ex.name,
        ex.series,
        exIdx
      )
      const exerciseId = exResult.lastInsertRowId

      const setCount = parseSeriesCount(ex.series)
      for (let s = 1; s <= setCount; s++) {
        await db.runAsync(
          "INSERT INTO sets (exercise_id, set_number, reps, sort_order) VALUES (?, ?, ?, ?)",
          exerciseId,
          s,
          ex.reps,
          s
        )
      }
    }
  }

  return Number(workoutId)
}

export async function getWorkoutById(id: number) {
  if (!db) throw new Error("Database not initialized")
  const row = await db.getFirstAsync(
    "SELECT id, name, created_at FROM workouts WHERE id = ?",
    id
  )
  return row as Workout | null
}

export async function getDayById(dayId: number) {
  if (!db) throw new Error("Database not initialized")
  const row = await db.getFirstAsync(
    "SELECT id, workout_id, name, subtitle, sort_order FROM days WHERE id = ?",
    dayId
  )
  return row as Day | null
}

export async function getDayExercises(dayId: number): Promise<ExerciseWithSets[]> {
  if (!db) throw new Error("Database not initialized")

  const exercises = await db.getAllAsync(
    "SELECT id, day_id, name, series, sort_order FROM exercises WHERE day_id = ? ORDER BY sort_order ASC",
    dayId
  ) as Omit<ExerciseWithSets, "sets">[]

  if (exercises.length === 0) return []

  const exerciseIds = exercises.map((e) => e.id)
  const placeholders = exerciseIds.map(() => "?").join(",")
  const sets = await db.getAllAsync(
    `SELECT id, exercise_id, set_number, reps, sort_order FROM sets WHERE exercise_id IN (${placeholders}) ORDER BY sort_order ASC`,
    ...exerciseIds
  ) as ExerciseWithSets["sets"]

  return exercises.map((ex) => ({
    ...ex,
    sets: sets.filter((s) => s.exercise_id === ex.id),
  }))
}

export async function createSession(dayId: number): Promise<number> {
  if (!db) throw new Error("Database not initialized")
  const result = await db.runAsync(
    "INSERT INTO workout_sessions (day_id) VALUES (?)",
    dayId
  )
  return Number(result.lastInsertRowId)
}

export async function logSet(
  sessionId: number,
  exerciseId: number,
  setIndex: number,
  weight: number,
  rirLabel: string
): Promise<number> {
  if (!db) throw new Error("Database not initialized")
  const result = await db.runAsync(
    "INSERT INTO session_sets (session_id, exercise_id, set_index, weight, rir_label) VALUES (?, ?, ?, ?, ?)",
    sessionId,
    exerciseId,
    setIndex,
    weight,
    rirLabel
  )
  return Number(result.lastInsertRowId)
}

export async function getSessionSets(sessionId: number, exerciseId: number): Promise<SessionSet[]> {
  if (!db) throw new Error("Database not initialized")
  return db.getAllAsync(
    "SELECT id, session_id, exercise_id, set_index, weight, rir_label, logged_at FROM session_sets WHERE session_id = ? AND exercise_id = ? ORDER BY set_index ASC",
    sessionId,
    exerciseId
  ) as Promise<SessionSet[]>
}

export async function getPreviousSessionWeights(dayId: number): Promise<Record<number, { weight: number; rirLabel: string }[]>> {
  if (!db) throw new Error("Database not initialized")

  const lastSessionId = await db.getFirstAsync(
    "SELECT id FROM workout_sessions WHERE day_id = ? AND completed = 1 ORDER BY ended_at DESC LIMIT 1",
    dayId
  ) as { id: number } | null

  if (!lastSessionId) return {}

  const rows = await db.getAllAsync(
    "SELECT exercise_id, weight, rir_label FROM session_sets WHERE session_id = ? ORDER BY set_index ASC",
    lastSessionId.id
  ) as { exercise_id: number; weight: number; rir_label: string }[]

  const result: Record<number, { weight: number; rirLabel: string }[]> = {}
  for (const row of rows) {
    if (!result[row.exercise_id]) result[row.exercise_id] = []
    result[row.exercise_id].push({ weight: row.weight, rirLabel: row.rir_label })
  }
  return result
}

export async function getLastWeightForExercise(exerciseId: number): Promise<number | null> {
  if (!db) throw new Error("Database not initialized")
  const row = await db.getFirstAsync(
    "SELECT weight FROM session_sets WHERE exercise_id = ? ORDER BY logged_at DESC LIMIT 1",
    exerciseId
  ) as { weight: number } | null
  return row?.weight ?? null
}

export async function updateSessionSet(
  id: number,
  weight: number,
  rirLabel: string
): Promise<void> {
  if (!db) throw new Error("Database not initialized")
  await db.runAsync(
    "UPDATE session_sets SET weight = ?, rir_label = ? WHERE id = ?",
    weight,
    rirLabel,
    id
  )
}

export async function deleteSessionSet(id: number): Promise<void> {
  if (!db) throw new Error("Database not initialized")
  await db.runAsync("DELETE FROM session_sets WHERE id = ?", id)
}

export async function getSessionById(sessionId: number): Promise<WorkoutSession | null> {
  if (!db) throw new Error("Database not initialized")
  return db.getFirstAsync(
    "SELECT id, day_id, started_at, ended_at, completed FROM workout_sessions WHERE id = ?",
    sessionId
  ) as Promise<WorkoutSession | null>
}

export async function getDayWithWorkout(dayId: number) {
  if (!db) throw new Error("Database not initialized")
  return db.getFirstAsync(
    `SELECT d.id, d.workout_id, d.name as day_name, d.subtitle, w.name as workout_name
     FROM days d
     JOIN workouts w ON d.workout_id = w.id
     WHERE d.id = ?`,
    dayId
  ) as Promise<{ id: number; workout_id: number; day_name: string; subtitle: string | null; workout_name: string } | null>
}

export async function getSessionSetsBySession(sessionId: number): Promise<SessionSet[]> {
  if (!db) throw new Error("Database not initialized")
  return db.getAllAsync(
    "SELECT id, session_id, exercise_id, set_index, weight, rir_label, logged_at FROM session_sets WHERE session_id = ? ORDER BY exercise_id, set_index ASC",
    sessionId
  ) as Promise<SessionSet[]>
}

export async function deleteSession(sessionId: number): Promise<void> {
  if (!db) throw new Error("Database not initialized")
  await db.runAsync("DELETE FROM session_sets WHERE session_id = ?", sessionId)
  await db.runAsync("DELETE FROM workout_sessions WHERE id = ?", sessionId)
}

export async function completeSession(sessionId: number): Promise<void> {
  if (!db) throw new Error("Database not initialized")
  await db.runAsync(
    "UPDATE workout_sessions SET completed = 1, ended_at = datetime('now') WHERE id = ?",
    sessionId
  )
}

export async function getWorkoutDays(workoutId: number) {
  if (!db) throw new Error("Database not initialized")
  return db.getAllAsync(
    "SELECT id, workout_id, name, subtitle, sort_order FROM days WHERE workout_id = ? ORDER BY sort_order ASC",
    workoutId
  )
}

export async function getWorkouts() {
  if (!db) throw new Error("Database not initialized")
  return db.getAllAsync(
    "SELECT id, name, created_at FROM workouts ORDER BY created_at DESC"
  )
}

export async function renameWorkout(id: number, name: string): Promise<void> {
  if (!db) throw new Error("Database not initialized")
  await db.runAsync("UPDATE workouts SET name = ? WHERE id = ?", name, id)
}

export async function deleteWorkout(id: number): Promise<void> {
  if (!db) throw new Error("Database not initialized")
  await db.runAsync("DELETE FROM workouts WHERE id = ?", id)
}

export async function clearAllData(): Promise<void> {
  if (!db) throw new Error("Database not initialized")
  await db.execAsync("PRAGMA foreign_keys = ON")
  await db.execAsync("DELETE FROM session_sets")
  await db.execAsync("DELETE FROM workout_sessions")
  await db.execAsync("DELETE FROM sets")
  await db.execAsync("DELETE FROM exercises")
  await db.execAsync("DELETE FROM days")
  await db.execAsync("DELETE FROM workouts")
  await db.execAsync("DELETE FROM sqlite_sequence")
}

export async function dumpDatabase() {
  if (!db) throw new Error("Database not initialized")

  const workouts = await db.getAllAsync("SELECT * FROM workouts")
  console.log("\n========== DATABASE DUMP ==========")
  console.log("\n=== workouts ===")
  console.table(workouts)

  const days = await db.getAllAsync("SELECT * FROM days")
  console.log("\n=== days ===")
  console.table(days)

  const exercises = await db.getAllAsync("SELECT * FROM exercises")
  console.log("\n=== exercises ===")
  console.table(exercises)

  const sets = await db.getAllAsync("SELECT * FROM sets")
  console.log("\n=== sets ===")
  console.table(sets)

  const sessions = await db.getAllAsync("SELECT * FROM workout_sessions")
  console.log("\n=== workout_sessions ===")
  console.table(sessions)

  const sessionSets = await db.getAllAsync("SELECT * FROM session_sets")
  console.log("\n=== session_sets ===")
  console.table(sessionSets)
  console.log("====================================\n")

  return { workouts, days, exercises, sets, sessions, sessionSets }
}
