import { View, Text, StyleSheet } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

import { useTheme } from "@/hooks/use-theme"
import { typography } from "@/constants/tokens"
import MiniWorkoutBar from "@/components/mini-workout-bar"
import type { RootStackParamList } from "@/app/navigator.types"

type Props = NativeStackScreenProps<RootStackParamList, "ExerciseHistory">

export default function ExerciseHistoryScreen({ route }: Props) {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MiniWorkoutBar />
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        Historial de {route.params.exerciseName}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
})
