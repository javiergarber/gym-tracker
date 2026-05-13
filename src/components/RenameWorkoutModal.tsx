import { useState } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"

import { colors, typography, radii, spacing } from "../theme"

interface Props {
  visible: boolean
  initialName: string
  onConfirm: (name: string) => void
  onCancel: () => void
}

export default function RenameWorkoutModal({ visible, initialName, onConfirm, onCancel }: Props) {
  const [name, setName] = useState(initialName)

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
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Renombrar entrenamiento</Text>
          <Text style={styles.label}>Nuevo nombre</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nombre del entrenamiento"
            placeholderTextColor="#999"
            autoFocus
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, !isValid && styles.disabledBtn]}
              onPress={handleConfirm}
              disabled={!isValid}
            >
              <Text style={[styles.confirmText, !isValid && styles.disabledText]}>
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
  label: {
    fontSize: typography.caption.fontSize,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    padding: 14,
    fontSize: typography.body.fontSize,
    color: colors.text,
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
    borderColor: colors.border,
    alignItems: "center",
  },
  cancelText: {
    fontSize: typography.body.fontSize,
    color: colors.textTertiary,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: colors.disabled,
  },
  confirmText: {
    fontSize: typography.body.fontSize,
    color: colors.surface,
    fontWeight: "600",
  },
  disabledText: {
    color: colors.surface,
  },
})
