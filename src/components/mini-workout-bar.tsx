import { View, Text, StyleSheet, type ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"

import { useTheme } from "@/hooks/use-theme"
import { useActiveWorkout } from "@/hooks/use-active-workout"
import { spacing, typography } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"
import type { RootStackParamList } from "@/app/navigator.types"

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

type Props = {
  style?: ViewStyle
}

export default function MiniWorkoutBar({ style }: Props) {
  const { colors } = useTheme()
  const { isActive, isMinimized, sessionData, elapsed, restoreWorkout } = useActiveWorkout()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  if (!isActive || !isMinimized || !sessionData) return null

  const dayId = sessionData.dayId

  function handlePress() {
    restoreWorkout()
    navigation.navigate("WorkoutOngoing", { dayId })
  }

  return (
    <HapticButton style={[styles.bar, { backgroundColor: colors.primary }, style]} onPress={handlePress}>
      <View style={styles.content}>
        <Text style={styles.label} numberOfLines={1}>
          {sessionData.workoutName} · {sessionData.dayName}
        </Text>
        <Text style={styles.timer}>{formatTime(elapsed)}</Text>
      </View>
    </HapticButton>
  )
}

const styles = StyleSheet.create({
  bar: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: typography.captionSmall.fontSize,
    fontWeight: "600",
    flex: 1,
    marginRight: spacing.md,
  },
  timer: {
    color: "#fff",
    fontSize: typography.captionSmall.fontSize,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
})
