export interface Workout {
  id: number
  name: string
  created_at: string
}

export interface Day {
  id: number
  workout_id: number
  name: string
  subtitle: string | null
  sort_order: number
}

export interface ExerciseSet {
  id: number
  exercise_id: number
  set_number: number
  reps: string
  sort_order: number
}

export interface ExerciseWithSets {
  id: number
  day_id: number
  name: string
  series: string
  sort_order: number
  sets: ExerciseSet[]
}
