import { useEffect, useState, useCallback } from "react"
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native"
import { StatusBar } from "expo-status-bar"

import { initDatabase, getWorkouts } from "./services/database"
import { seedDatabase } from "./services/seed"
import Home from "./Home"
import type { Workout } from "./Home"

export default function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [dbReady, setDbReady] = useState(false)

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
      .then(async () => {
        await seedDatabase()
        setDbReady(true)
        return refreshWorkouts()
      })
      .catch((e) => {
        Alert.alert("Error", "No se pudo inicializar la base de datos")
        console.error(e)
      })
      .finally(() => setLoading(false))
  }, [refreshWorkouts])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      {dbReady && <Home workouts={workouts} onRefresh={refreshWorkouts} />}
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
})
