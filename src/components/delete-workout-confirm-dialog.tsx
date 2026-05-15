import { Modal, View, Text, StyleSheet } from "react-native"

import { useTheme } from "@/hooks/use-theme"
import { typography, radii, spacing } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"

interface Props {
  visible: boolean
  workoutName: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteWorkoutConfirmDialog({ visible, workoutName, onConfirm, onCancel }: Props) {
  const { colors } = useTheme()

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>Eliminar entrenamiento</Text>
          <Text style={[styles.message, { color: colors.textTertiary }]}>
            ¿Estás seguro de que quieres eliminar "{workoutName}"? Esta acción no se puede deshacer.
          </Text>
          <View style={styles.actions}>
            <HapticButton style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onCancel}>
              <Text style={[styles.cancelText, { color: colors.textTertiary }]}>Cancelar</Text>
            </HapticButton>
            <HapticButton style={styles.deleteBtn} onPress={onConfirm}>
              <Text style={styles.deleteText}>Eliminar</Text>
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
  deleteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.sm,
    backgroundColor: "#FF3B30",
    alignItems: "center",
  },
  deleteText: {
    fontSize: typography.body.fontSize,
    color: "#fff",
    fontWeight: "600",
  },
})
