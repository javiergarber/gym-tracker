import { Modal, View, Text, StyleSheet } from "react-native"

import { useTheme } from "@/hooks/use-theme"
import { typography, radii, spacing } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"

interface Props {
  visible: boolean
  exerciseName: string
  pendingCount: number
  onConfirm: () => void
  onCancel: () => void
}

export default function PendingSetsDialog({ visible, exerciseName, pendingCount, onConfirm, onCancel }: Props) {
  const { colors } = useTheme()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>Series pendientes</Text>
          <Text style={[styles.message, { color: colors.textTertiary }]}>
            Todavía tienes <Text style={{ color: colors.text, fontWeight: "600" }}>{pendingCount}</Text> serie{pendingCount !== 1 ? "s" : ""} sin registrar de «{exerciseName}».
            {"\n\n"}¿Continuar de todas formas?
          </Text>
          <View style={styles.actions}>
            <HapticButton style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={onCancel}>
              <Text style={[styles.cancelText, { color: colors.textTertiary }]}>Seguir entrenando</Text>
            </HapticButton>
            <HapticButton style={[styles.confirmBtn, { backgroundColor: colors.primary }]} onPress={onConfirm}>
              <Text style={styles.confirmText}>Continuar</Text>
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
