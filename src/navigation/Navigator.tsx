import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useTheme } from "../context/ThemeContext"
import type { RootStackParamList } from "./types"
import HomeScreen from "../screens/Home"
import WorkoutDetailScreen from "../screens/WorkoutDetailScreen"
import SettingsScreen from "../screens/SettingsScreen"

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
