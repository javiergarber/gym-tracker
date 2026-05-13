import { useState, useCallback } from "react"
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native"
import * as DocumentPicker from "expo-document-picker"
import { readAsStringAsync } from "expo-file-system/legacy"

import { importWorkout, getWorkouts, dumpDatabase } from "./services/database"
import { parseCSV } from "./services/csv-parser"
import type { CSVParseError } from "./services/csv-parser"
import NewWorkoutDialog from "./components/NewWorkoutDialog"

export interface Workout {
  id: number
  name: string
  created_at: string
}

interface Props {
  workouts: Workout[]
  onRefresh: () => Promise<void>
}

export default function Home({ workouts, onRefresh }: Props) {
  const [importing, setImporting] = useState(false)
  useWindowDimensions()
  const [showDialog, setShowDialog] = useState(false)

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis entrenamientos</Text>
      </View>

      {workouts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No hay entrenamientos</Text>
          <Text style={styles.emptySubtitle}>
            Importa un archivo CSV para comenzar
          </Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDate}>
                {new Date(item.created_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          )}
        />
      )}

      {__DEV__ && (
        <TouchableOpacity
          style={styles.debugBtn}
          onPress={async () => {
            const data = await dumpDatabase()
            Alert.alert(
              "DB Stats",
              `workouts: ${data.workouts.length}\ndays: ${data.days.length}\nexercises: ${data.exercises.length}\nsets: ${data.sets.length}\n\nMira la consola para los datos completos.`
            )
          }}
        >
          <Text style={styles.debugBtnText}>🐞</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.fab, importing && styles.fabDisabled]}
        onPress={handleNewWorkout}
        disabled={importing}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {importing && (
        <View style={styles.importingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.importingText}>Importando entrenamiento...</Text>
        </View>
      )}

      <NewWorkoutDialog
        visible={showDialog}
        onConfirm={handleDialogConfirm}
        onCancel={() => setShowDialog(false)}
      />
    </View>
  )
}

const POS = Platform.select({ web: "fixed", default: "absolute" }) as any
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 13,
    color: "#999",
  },
  fab: {
    position: POS,
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabDisabled: {
    backgroundColor: "#ccc",
    shadowColor: "#999",
  },
  fabText: {
    fontSize: 28,
    color: "#fff",
    lineHeight: 30,
  },
  importingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  importingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  debugBtn: {
    position: POS,
    bottom: 28,
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.07)",
    justifyContent: "center",
    alignItems: "center",
  },
  debugBtnText: {
    fontSize: 20,
  },
})
