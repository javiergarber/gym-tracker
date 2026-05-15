import * as SQLite from "expo-sqlite"
import type { ParsedCSV } from "./csv-parser"
import type { Workout } from "@/constants/types"

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
  console.log("====================================\n")

  return { workouts, days, exercises, sets }
}
