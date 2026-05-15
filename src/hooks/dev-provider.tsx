import { useEffect, type ReactNode } from "react"
import { useSyncExternalStore } from "react"

import { useDrizzleStudio } from "expo-drizzle-studio-plugin"

import { getDb, subscribeToDb } from "@/server/database"

function DevContent({ children }: { children: ReactNode }) {
  const db = useSyncExternalStore(subscribeToDb, getDb)

  useDrizzleStudio(db)

  return <>{children}</>
}

export function DevProvider({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") return <>{children}</>
  return <DevContent>{children}</DevContent>
}
