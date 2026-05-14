import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { ActivityIndicator, Alert, View, StyleSheet } from "react-native"

import { initDatabase, getWorkouts, renameWorkout, deleteWorkout } from "../services/database"
import { useTheme } from "./ThemeContext"
import type { Workout } from "../types"

interface DatabaseContextValue {
  workouts: Workout[]
  loading: boolean
  onRefresh: () => Promise<void>
  renameWorkout: (id: number, name: string) => Promise<void>
  deleteWorkout: (id: number) => Promise<void>
}

const DatabaseContext = createContext<DatabaseContextValue | null>(null)

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const { colors } = useTheme()

  const refreshWorkouts = useCallback(async () => {
    try {
      const data = await getWorkouts()
      setWorkouts(data as Workout[])
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    initDatabase()
      .then(() => refreshWorkouts())
      .catch((e) => {
        Alert.alert("Error", "No se pudo inicializar la base de datos")
        console.error(e)
      })
      .finally(() => setLoading(false))
  }, [refreshWorkouts])

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <DatabaseContext.Provider value={{ workouts, loading, onRefresh: refreshWorkouts, renameWorkout, deleteWorkout }}>
      {children}
    </DatabaseContext.Provider>
  )
}

export function useDatabase() {
  const ctx = useContext(DatabaseContext)
  if (!ctx) throw new Error("useDatabase must be used within DatabaseProvider")
  return ctx
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
