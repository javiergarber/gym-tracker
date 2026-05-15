import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "@/hooks/use-theme"
import { spacing, typography, radii } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"

interface Props {
  onLogSet: (rirLabel: string) => void
  onFinishExercise: () => void
  disabled?: boolean
}

export default function ActionBar({ onLogSet, onFinishExercise, disabled }: Props) {
  const { colors } = useTheme()

  const perfColor = "#00897B"

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <HapticButton
          style={[styles.rirButton, { backgroundColor: perfColor }]}
          onPress={() => onLogSet("perfecta")}
          disabled={disabled}
        >
          <Text style={styles.rirIcon}>0</Text>
          <Text style={styles.rirLabel}>PERFECTA</Text>
        </HapticButton>

        <HapticButton
          style={[styles.rirButton, { backgroundColor: "#D32F2F" }]}
          onPress={() => onLogSet("fallo")}
          disabled={disabled}
        >
          <Text style={styles.rirIcon}>✕</Text>
          <Text style={styles.rirLabel}>AL</Text>
          <Text style={styles.rirLabel}>FALLO</Text>
        </HapticButton>

        <HapticButton
          style={[styles.rirButton, { backgroundColor: colors.primary }]}
          onPress={() => onLogSet("rir1-2")}
          disabled={disabled}
        >
          <Text style={styles.rirIcon}>①②</Text>
          <Text style={styles.rirLabel}>RIR</Text>
          <Text style={styles.rirLabel}>1-2</Text>
        </HapticButton>

        <HapticButton
          style={[styles.rirButton, { backgroundColor: "#9C27B0" }]}
          onPress={() => onLogSet("rir3+")}
          disabled={disabled}
        >
          <Text style={styles.rirIcon}>③+</Text>
          <Text style={styles.rirLabel}>RIR</Text>
          <Text style={styles.rirLabel}>3+</Text>
        </HapticButton>
      </View>

      <HapticButton
        style={[styles.finishButton, { backgroundColor: "#2E7D32" }]}
        onPress={onFinishExercise}
        disabled={disabled}
      >
        <Text style={styles.finishIcon}>✓</Text>
        <Text style={styles.finishLabel}>ACABAR EJERCICIO</Text>
      </HapticButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  rirButton: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  rirIcon: {
    fontSize: 20,
    color: "#fff",
  },
  rirLabel: {
    fontSize: typography.captionSmall.fontSize,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  finishButton: {
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  finishIcon: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  finishLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
})
