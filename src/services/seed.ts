import { Asset } from "expo-asset"
import { Platform } from "react-native"

import { importWorkout, clearAllData } from "./database"
import { parseCSV } from "./csv-parser"

export async function seedDatabase(): Promise<void> {
  if (!__DEV__) return

  try {
    await clearAllData()

    const asset = Asset.fromModule(require("../../test/workout.csv"))
    await asset.downloadAsync()
    const uri = asset.localUri!

    let csvContent: string
    if (Platform.OS === "web") {
      const response = await fetch(uri)
      csvContent = await response.text()
    } else {
      const { readAsStringAsync } = require("expo-file-system/legacy")
      csvContent = await readAsStringAsync(uri)
    }

    const parsed = parseCSV(csvContent)
    await importWorkout("Rutina de prueba", parsed)
  } catch (e) {
    console.warn("No se pudo sembrar la base de datos:", e)
  }
}
