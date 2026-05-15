export type RootStackParamList = {
  Home: undefined
  WorkoutDetail: { workoutId: number }
  DayDetail: { dayId: number }
  ExerciseHistory: { exerciseId: number; exerciseName: string }
  WorkoutOngoing: { dayId: number }
  Settings: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
