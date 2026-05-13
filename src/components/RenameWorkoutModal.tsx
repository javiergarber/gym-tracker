import { useState } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"

import { useTheme } from "../context/ThemeContext"
import { typography, radii, spacing } from "../tokens"

interface Props {
  visible: boolean
  initialName: string
  onConfirm: (name: string) => void
  onCancel: () => void
}

export default function RenameWorkoutModal({ visible, initialName, onConfirm, onCancel }: Props) {
  const [name, setName] = useState(initialName)
  const { colors } = useTheme()

  const handleConfirm = () => {
    if (name.trim()) {
      onConfirm(name.trim())
    }
  }

  const handleCancel = () => {
    setName(initialName)
    onCancel()
  }

  const isValid = name.trim().length > 0 && name.trim() !== initialName

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>Renombrar entrenamiento</Text>
          <Text style={[styles.label, { color: colors.textTertiary }]}>Nuevo nombre</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Nombre del entrenamiento"
            placeholderTextColor={colors.textMuted}
            autoFocus
          />
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={handleCancel}>
              <Text style={[styles.cancelText, { color: colors.textTertiary }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: colors.primary }, !isValid && { backgroundColor: colors.disabled }]}
              onPress={handleConfirm}
              disabled={!isValid}
            >
              <Text style={[styles.confirmText, { color: colors.surface }]}>
                Renombrar
              </Text>
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
