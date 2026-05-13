import { useCallback, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native"
type SwipeableHandle = { close: () => void } | null
import * as DocumentPicker from "expo-document-picker"
import { readAsStringAsync } from "expo-file-system/legacy"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

import { importWorkout } from "../services/database"
import { parseCSV } from "../services/csv-parser"
import type { CSVParseError } from "../services/csv-parser"
import type { RootStackParamList } from "../navigation/types"
import type { Workout } from "../types"
import { useDatabase } from "../context/DatabaseContext"
import { useTheme } from "../context/ThemeContext"
import { spacing, typography, radii } from "../tokens"
import NewWorkoutDialog from "../components/NewWorkoutDialog"
import RenameWorkoutModal from "../components/RenameWorkoutModal"
import DeleteWorkoutConfirmDialog from "../components/DeleteWorkoutConfirmDialog"
import WorkoutCard from "../components/WorkoutCard"

type Props = NativeStackScreenProps<RootStackParamList, "Home">

export default function Home({ navigation }: Props) {
  const [importing, setImporting] = useState(false)
  useWindowDimensions()
  const [showDialog, setShowDialog] = useState(false)
  const [renameTarget, setRenameTarget] = useState<Workout | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Workout | null>(null)
  const [openSwipeable, setOpenSwipeable] = useState<SwipeableHandle>(null)
  const { workouts, onRefresh, renameWorkout: renameDb, deleteWorkout: deleteDb } = useDatabase()
  const { colors } = useTheme()

  const handleNewWorkout = () => {
    setShowDialog(true)
  }

  const handleDialogConfirm = async (name: string) => {
    setShowDialog(false)
    setImporting(true)

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
        copyToCacheDirectory: true,
      })

      if (result.canceled) {
        setImporting(false)
        return
      }

      const file = result.assets[0]
      if (!file.uri) {
        setImporting(false)
        Alert.alert("Error", "No se pudo leer el archivo seleccionado")
        return
      }

      const content = Platform.OS === "web"
        ? await fetch(file.uri).then((r) => r.text())
        : await readAsStringAsync(file.uri)
      const parsed = parseCSV(content)
      await importWorkout(name, parsed)
      await onRefresh()

      Alert.alert("Éxito", `Entrenamiento "${name}" importado correctamente`)
    } catch (e: unknown) {
      const err = e as CSVParseError | Error
      Alert.alert("Error", err.message || "Ocurrió un error al importar el archivo")
      console.error(e)
    } finally {
      setImporting(false)
    }
  }

  const handleRename = useCallback((workout: Workout) => {
    setRenameTarget(workout)
  }, [])

  const handleDelete = useCallback((workout: Workout) => {
    setDeleteTarget(workout)
  }, [])

  const handleOpenChange = useCallback((swipeable: SwipeableHandle) => {
    setOpenSwipeable(swipeable)
  }, [])

  const handleOverlayPress = useCallback(() => {
    openSwipeable?.close()
    setOpenSwipeable(null)
  }, [openSwipeable])

  const handleRenameConfirm = useCallback(async (name: string) => {
    if (!renameTarget) return
    try {
      await renameDb(renameTarget.id, name)
      setRenameTarget(null)
      await onRefresh()
    } catch (e) {
      Alert.alert("Error", "No se pudo renombrar el entrenamiento")
      console.error(e)
    }
  }, [renameTarget, renameDb, onRefresh])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await deleteDb(deleteTarget.id)
      setDeleteTarget(null)
      await onRefresh()
    } catch (e) {
      Alert.alert("Error", "No se pudo eliminar el entrenamiento")
      console.error(e)
    }
  }, [deleteTarget, deleteDb, onRefresh])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.inner}>
        <View style={[styles.header, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>Mis entrenamientos</Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate("Settings")}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {workouts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No hay entrenamientos todavía</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>¡Crea uno!</Text>
            <TouchableOpacity style={[styles.emptyBtn, { backgroundColor: colors.primary }]} onPress={handleNewWorkout}>
              <Text style={[styles.emptyBtnText, { color: colors.surface }]}>Nuevo entrenamiento</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <WorkoutCard
                workout={item}
                onPress={() => navigation.navigate("WorkoutDetail", { workoutId: item.id })}
                onRename={() => handleRename(item)}
                onDelete={() => handleDelete(item)}
                onOpenChange={handleOpenChange}
              />
            )}
          />
        )}

        {openSwipeable && (
          <Pressable style={styles.overlay} onPress={handleOverlayPress} />
        )}

        {workouts.length > 0 && (
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.shadowPrimary }, importing && { backgroundColor: colors.disabled, shadowColor: colors.disabled }]}
            onPress={handleNewWorkout}
            disabled={importing}
          >
            <Text style={[styles.fabText, { color: colors.surface }]}>+</Text>
          </TouchableOpacity>
        )}

        {importing && (
          <View style={[styles.importingOverlay, { backgroundColor: colors.overlayDark }]}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={[styles.importingText, { color: colors.surface }]}>Importando entrenamiento...</Text>
          </View>
        )}

        <NewWorkoutDialog
          visible={showDialog}
          onConfirm={handleDialogConfirm}
          onCancel={() => setShowDialog(false)}
        />

        <RenameWorkoutModal
          visible={renameTarget !== null}
          initialName={renameTarget?.name ?? ""}
          onConfirm={handleRenameConfirm}
          onCancel={() => setRenameTarget(null)}
        />

        <DeleteWorkoutConfirmDialog
          visible={deleteTarget !== null}
          workoutName={deleteTarget?.name ?? ""}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      </View>
    </View>
  )
}

const POS = Platform.select({ web: "fixed", default: "absolute" }) as any
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: Platform.OS === "web" ? "center" : undefined,
  },
  inner: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 800 : undefined,
  },
  header: {
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
  },
  settingsBtn: {
    padding: spacing.sm,
  },
  settingsIcon: {
    fontSize: 24,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.bodySmall.fontSize,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  emptyBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: radii.sm,
  },
  emptyBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    padding: spacing.lg,
  },
  fab: {
    position: POS,
    bottom: spacing.xxxl,
    right: spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: typography.fab.fontSize,
    lineHeight: 30,
  },
  importingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  importingText: {
    marginTop: spacing.md,
    fontSize: typography.body.fontSize,
    fontWeight: "500",
  },
  overlay: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
  },
})
