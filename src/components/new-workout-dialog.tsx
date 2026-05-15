import { useState } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native"

import { useTheme } from "@/hooks/use-theme"
import { typography, radii, spacing } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"

interface Props {
  visible: boolean
  onConfirm: (name: string) => void
  onCancel: () => void
}

export default function NewWorkoutDialog({ visible, onConfirm, onCancel }: Props) {
  const [name, setName] = useState("")
  const { colors } = useTheme()

  const handleConfirm = () => {
    if (name.trim()) {
      onConfirm(name.trim())
      setName("")
    }
  }

  const handleCancel = () => {
    setName("")
    onCancel()
  }

  const isValid = name.trim().length > 0

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>Nuevo entrenamiento</Text>
          <Text style={[styles.label, { color: colors.textTertiary }]}>Nombre del entrenamiento</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Junio 2026, Semana 1..."
            placeholderTextColor={colors.textMuted}
            autoFocus
          />
          <View style={styles.actions}>
            <HapticButton style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={handleCancel}>
              <Text style={[styles.cancelText, { color: colors.textTertiary }]}>Cancelar</Text>
            </HapticButton>
            <HapticButton
              style={[styles.confirmBtn, { backgroundColor: colors.primary }, !isValid && { backgroundColor: colors.disabled }]}
              onPress={handleConfirm}
              disabled={!isValid}
            >
              <Text style={[styles.confirmText, { color: colors.surface }]}>
                Seleccionar archivo
              </Text>
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
  label: {
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: radii.sm,
    padding: 14,
    fontSize: typography.body.fontSize,
    marginBottom: spacing.xl,
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
    fontWeight: "600",
  },
})
