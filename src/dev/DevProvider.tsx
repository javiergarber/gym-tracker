import { useEffect, useRef, type ReactNode } from "react"
import { useSyncExternalStore } from "react"

import { useDrizzleStudio } from "expo-drizzle-studio-plugin"

import { getDb, subscribeToDb } from "../services/database"
import { seedDatabase } from "../services/seed"
import { useDatabase } from "../context/DatabaseContext"

function DevContent({ children }: { children: ReactNode }) {
  const db = useSyncExternalStore(subscribeToDb, getDb)
  const { onRefresh } = useDatabase()
  const seeded = useRef(false)

  useDrizzleStudio(db)

  useEffect(() => {
    if (!db || seeded.current) return
    seeded.current = true
    seedDatabase().then(() => onRefresh())
  }, [db, onRefresh])

  return <>{children}</>
}

export function DevProvider({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") return <>{children}</>
  return <DevContent>{children}</DevContent>
}
