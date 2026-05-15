import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useTheme } from "@/hooks/use-theme"
import type { RootStackParamList } from "@/app/navigator.types"
import HomeScreen from "@/screens/home/index"
import WorkoutDetailScreen from "@/screens/workout-detail"
import DayDetailScreen from "@/screens/day-detail"
import ExerciseHistoryScreen from "@/screens/exercise-history"
import WorkoutOngoingScreen from "@/screens/workout-ongoing"
import SettingsScreen from "@/screens/settings"

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Navigator() {
  const { colors } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: "Volver",
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name="DayDetail"
        component={DayDetailScreen}
        options={{ title: "" }}
      />
      <Stack.Screen
        name="ExerciseHistory"
        component={ExerciseHistoryScreen}
        options={{ title: "Historial" }}
      />
      <Stack.Screen
        name="WorkoutOngoing"
        component={WorkoutOngoingScreen}
        options={{ title: "Entrenamiento" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Ajustes" }}
      />
    </Stack.Navigator>
  )
}
