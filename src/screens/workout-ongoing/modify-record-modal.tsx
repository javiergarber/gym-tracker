import { useEffect, useState } from "react"
import { Modal, View, Text, TextInput, StyleSheet, FlatList } from "react-native"

import { useTheme } from "@/hooks/use-theme"
import { spacing, typography, radii } from "@/constants/tokens"
import { getSessionSets, updateSessionSet, deleteSessionSet } from "@/server/database"
import type { SessionSet } from "@/constants/types"
import HapticButton from "@/components/haptic-button"

interface Props {
  visible: boolean
  sessionId: number
  exerciseId: number
  exerciseName: string
  onClose: () => void
  onModified: () => void
}

const RIR_LABELS: Record<string, string> = {
  perfecta: "PERFECTA",
  fallo: "FALLO",
  "rir1-2": "RIR 1-2",
  "rir3+": "RIR 3+",
}

const RIR_SUFFIX: Record<string, string> = {
  perfecta: "",
  fallo: "!",
  "rir1-2": "+",
  "rir3+": "*",
}

export default function ModifyRecordModal({
  visible,
  sessionId,
  exerciseId,
  exerciseName,
  onClose,
  onModified,
}: Props) {
  const { colors } = useTheme()
  const [sets, setSets] = useState<SessionSet[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editWeight, setEditWeight] = useState("")
  const [editRir, setEditRir] = useState("")
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (visible && sessionId && exerciseId) {
      loadSets()
    }
  }, [visible, sessionId, exerciseId])

  async function loadSets() {
    const data = await getSessionSets(sessionId, exerciseId)
    setSets(data)
  }

  function handleDelete(id: number) {
    setDeleteTargetId(id)
  }

  async function confirmDelete() {
    if (deleteTargetId === null) return
    await deleteSessionSet(deleteTargetId)
    setDeleteTargetId(null)
    await loadSets()
    onModified()
  }

  function startEdit(set: SessionSet) {
    setEditingId(set.id)
    setEditWeight(String(set.weight))
    setEditRir(set.rir_label)
  }

  async function saveEdit() {
    if (editingId === null) return
    const weight = parseFloat(editWeight)
    if (isNaN(weight) || weight < 0) {
      setErrorMessage("Introduce un peso válido")
      return
    }
    await updateSessionSet(editingId, weight, editRir)
    setEditingId(null)
    await loadSets()
    onModified()
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function cycleRir(current: string): string {
    const order = ["perfecta", "fallo", "rir1-2", "rir3+"]
    const idx = order.indexOf(current)
    return order[(idx + 1) % order.length]
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {exerciseName}
            </Text>
            <HapticButton onPress={onClose}>
              <Text style={[styles.closeBtn, { color: colors.textMuted }]}>✕</Text>
            </HapticButton>
          </View>

          <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
            {sets.length} serie{sets.length !== 1 ? "s" : ""} registrada{sets.length !== 1 ? "s" : ""}
          </Text>

          <FlatList
            data={sets}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <View style={[styles.setRow, { borderColor: colors.border }]}>
                <Text style={[styles.setIndex, { color: colors.textSecondary }]}>#{index + 1}</Text>

                {editingId === item.id ? (
                  <View style={styles.editFields}>
                    <View style={styles.editRow}>
                      <TextInput
                        style={[styles.weightInput, { color: colors.text, borderColor: colors.border }]}
                        value={editWeight}
                        onChangeText={setEditWeight}
                        keyboardType="decimal-pad"
                        selectTextOnFocus
                      />
                      <HapticButton
                        style={[styles.rirBadge, { backgroundColor: getRirColor(editRir, colors) }]}
                        onPress={() => setEditRir(cycleRir(editRir))}
                      >
                        <Text style={styles.rirBadgeText}>
                          {RIR_LABELS[editRir] || editRir}
                        </Text>
                      </HapticButton>
                      <HapticButton style={styles.saveBtn} onPress={saveEdit}>
                        <Text style={[styles.saveBtnText, { color: colors.primary }]}>OK</Text>
                      </HapticButton>
                      <HapticButton onPress={cancelEdit}>
                        <Text style={[styles.cancelEditText, { color: colors.textMuted }]}>✕</Text>
                      </HapticButton>
                    </View>
                  </View>
                ) : (
                  <View style={styles.setInfo}>
                    <Text style={[styles.setWeight, { color: colors.text }]}>
                      {item.weight}{RIR_SUFFIX[item.rir_label] ?? ""}
                    </Text>
                    <View
                      style={[styles.rirBadge, { backgroundColor: getRirColor(item.rir_label, colors) }]}
                    >
                      <Text style={styles.rirBadgeText}>
                        {RIR_LABELS[item.rir_label] || item.rir_label}
                      </Text>
                    </View>
                  </View>
                )}

                {editingId !== item.id && (
                  <View style={styles.setActions}>
                    <HapticButton onPress={() => startEdit(item)}>
                      <Text style={[styles.editActionText, { color: colors.primary }]}>Editar</Text>
                    </HapticButton>
                    <HapticButton onPress={() => handleDelete(item.id)}>
                      <Text style={[styles.deleteActionText, { color: colors.danger }]}>Borrar</Text>
                    </HapticButton>
                  </View>
                )}
              </View>
            )}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No hay series registradas para este ejercicio.
              </Text>
            }
          />
        </View>
      </View>

      <Modal visible={deleteTargetId !== null} transparent animationType="fade">
        <View style={[styles.overlayCentered, { backgroundColor: colors.overlay }]}>
          <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
            <Text style={[styles.dialogTitle, { color: colors.text }]}>Borrar serie</Text>
            <Text style={[styles.dialogMessage, { color: colors.textTertiary }]}>
              ¿Estás seguro de que quieres borrar esta serie?
            </Text>
            <View style={styles.dialogActions}>
              <HapticButton
                style={[styles.dialogCancelBtn, { borderColor: colors.border }]}
                onPress={() => setDeleteTargetId(null)}
              >
                <Text style={[styles.dialogCancelText, { color: colors.textTertiary }]}>Cancelar</Text>
              </HapticButton>
              <HapticButton style={[styles.dialogConfirmBtn, { backgroundColor: colors.danger }]} onPress={confirmDelete}>
                <Text style={styles.dialogConfirmText}>Borrar</Text>
              </HapticButton>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={errorMessage !== ""} transparent animationType="fade">
        <View style={[styles.overlayCentered, { backgroundColor: colors.overlay }]}>
          <View style={[styles.dialog, { backgroundColor: colors.surface }]}>
            <Text style={[styles.dialogTitle, { color: colors.text }]}>Error</Text>
            <Text style={[styles.dialogMessage, { color: colors.textTertiary }]}>
              {errorMessage}
            </Text>
            <View style={styles.dialogActions}>
              <HapticButton
                style={[styles.dialogConfirmBtn, { backgroundColor: colors.primary, flex: 1 }]}
                onPress={() => setErrorMessage("")}
              >
                <Text style={styles.dialogConfirmText}>OK</Text>
              </HapticButton>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  )
}

function getRirColor(rir: string, colors: any): string {
  switch (rir) {
    case "perfecta":
      return "#00897B"
    case "fallo":
      return "#D32F2F"
    case "rir1-2":
      return colors.primary
    case "rir3+":
      return "#9C27B0"
    default:
      return colors.textTertiary
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  card: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.lg,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    flex: 1,
    marginRight: spacing.md,
  },
  closeBtn: {
    fontSize: 20,
    padding: spacing.xs,
  },
  subtitle: {
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.md,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    gap: spacing.md,
  },
  setIndex: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "600",
    width: 28,
  },
  setInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  setWeight: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
  rirBadge: {
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  rirBadgeText: {
    color: "#fff",
    fontSize: typography.captionSmall.fontSize,
    fontWeight: "700",
  },
  setActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  editActionText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "600",
  },
  deleteActionText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "600",
  },
  editFields: {
    flex: 1,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  saveBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  saveBtnText: {
    fontSize: typography.body.fontSize,
    fontWeight: "700",
  },
  cancelEditText: {
    fontSize: 18,
    padding: spacing.xs,
  },
  weightInput: {
    fontSize: typography.body.fontSize,
    fontWeight: "700",
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minWidth: 72,
    textAlign: "center",
  },
  overlayCentered: {
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
  dialogTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    marginBottom: spacing.lg,
  },
  dialogMessage: {
    fontSize: typography.body.fontSize,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  dialogActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  dialogCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.sm,
    borderWidth: 1,
    alignItems: "center",
  },
  dialogCancelText: {
    fontSize: typography.body.fontSize,
  },
  dialogConfirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.sm,
    alignItems: "center",
  },
  dialogConfirmText: {
    fontSize: typography.body.fontSize,
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    textAlign: "center",
    paddingVertical: spacing.xxl,
  },
})
