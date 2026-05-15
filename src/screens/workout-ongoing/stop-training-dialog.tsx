import { Modal, View, Text, StyleSheet } from "react-native"

import { useTheme } from "@/hooks/use-theme"
import { typography, radii, spacing } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"

interface Props {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
  title?: string
  message?: string
  confirmText?: string
  destructive?: boolean
}

export default function StopTrainingDialog({
  visible,
  onConfirm,
  onCancel,
  title = "Finalizar entrenamiento",
  message = "¿Estás seguro de que quieres finalizar el entrenamiento? La sesión se guardará como completada.",
  confirmText = "Finalizar",
  destructive,
}: Props) {
  const { colors } = useTheme()

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textTertiary }]}>
            {message}
          </Text>
          <View style={styles.actions}>
            <HapticButton style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onCancel}>
              <Text style={[styles.cancelText, { color: colors.textTertiary }]}>Cancelar</Text>
            </HapticButton>
            <HapticButton style={[styles.stopBtn, destructive && { backgroundColor: colors.textTertiary }]} onPress={onConfirm}>
              <Text style={styles.stopText}>{confirmText}</Text>
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
  stopBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.sm,
    backgroundColor: "#FF3B30",
    alignItems: "center",
  },
  stopText: {
    fontSize: typography.body.fontSize,
    color: "#fff",
    fontWeight: "600",
  },
})
