export type RootStackParamList = {
  Home: undefined
  WorkoutDetail: { workoutId: number }
  Settings: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
