import { Modal, View, Text, StyleSheet } from "react-native"

import { useTheme } from "@/hooks/use-theme"
import { typography, radii, spacing } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"

interface Props {
  visible: boolean
  exerciseNames: string[]
  onConfirm: () => void
  onCancel: () => void
}

export default function SkippedExercisesDialog({ visible, exerciseNames, onConfirm, onCancel }: Props) {
  const { colors } = useTheme()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>Ejercicios sin completar</Text>
          <Text style={[styles.message, { color: colors.textTertiary }]}>
            Los siguientes ejercicios no tienen ninguna serie registrada:
          </Text>
          <View style={styles.list}>
            {exerciseNames.map((name, i) => (
              <Text key={i} style={[styles.listItem, { color: colors.text }]}>
                • {name}
              </Text>
            ))}
          </View>
          <Text style={[styles.footer, { color: colors.textTertiary }]}>
            ¿Finalizar el entrenamiento de todas formas?
          </Text>
          <View style={styles.actions}>
            <HapticButton style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onCancel}>
              <Text style={[styles.cancelText, { color: colors.textTertiary }]}>Ir al ejercicio</Text>
            </HapticButton>
            <HapticButton style={[styles.confirmBtn, { backgroundColor: colors.danger }]} onPress={onConfirm}>
              <Text style={styles.confirmText}>Finalizar</Text>
            </HapticButton>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  dialog: {
    borderRadius: radii.xl,
    padding: spacing.xxl,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    marginBottom: spacing.lg,
  },
  message: {
    fontSize: typography.body.fontSize,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  list: {
    marginBottom: spacing.lg,
    paddingLeft: spacing.sm,
  },
  listItem: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    lineHeight: 26,
  },
  footer: {
    fontSize: typography.body.fontSize,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.sm,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelText: {
    fontSize: typography.body.fontSize,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.sm,
    alignItems: "center",
  },
  confirmText: {
    fontSize: typography.body.fontSize,
    color: "#fff",
    fontWeight: "600",
  },
})
