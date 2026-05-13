import { useState } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native"

import { colors, typography, radii, spacing } from "../theme"

interface Props {
  visible: boolean
  onConfirm: (name: string) => void
  onCancel: () => void
}

export default function NewWorkoutDialog({ visible, onConfirm, onCancel }: Props) {
  const [name, setName] = useState("")

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
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Nuevo entrenamiento</Text>
          <Text style={styles.label}>Nombre del entrenamiento</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Junio 2026, Semana 1..."
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
                Seleccionar archivo
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
