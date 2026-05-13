import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"

import { colors, typography, radii, spacing } from "../theme"

interface Props {
  visible: boolean
  workoutName: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteWorkoutConfirmDialog({ visible, workoutName, onConfirm, onCancel }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Eliminar entrenamiento</Text>
          <Text style={styles.message}>
            ¿Estás seguro de que quieres eliminar "{workoutName}"? Esta acción no se puede deshacer.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    marginBottom: spacing.lg,
    color: colors.text,
  },
  message: {
    fontSize: typography.body.fontSize,
    color: colors.textTertiary,
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
    borderColor: colors.border,
    alignItems: "center",
  },
  cancelText: {
    fontSize: typography.body.fontSize,
    color: colors.textTertiary,
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
    color: colors.surface,
    fontWeight: "600",
  },
})
