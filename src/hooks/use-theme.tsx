import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { themes, type ThemeName, type Theme, type ThemeColors } from "@/constants/theme"

const STORAGE_KEY = "theme"
const REST_TIMER_KEY = "restTimer"

interface ThemeContextValue {
  themeName: ThemeName
  theme: Theme
  colors: ThemeColors
  setThemeName: (name: ThemeName) => Promise<void>
  restTimer: number
  setRestTimer: (seconds: number) => Promise<void>
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>("negroNeon")
  const [restTimer, setRestTimerState] = useState(90)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === "negroNeon" || saved === "azul") {
        setThemeNameState(saved)
      }
    })
    AsyncStorage.getItem(REST_TIMER_KEY).then((saved) => {
      if (saved) {
        const num = Number(saved)
        if ([60, 90, 120].includes(num)) {
          setRestTimerState(num)
        }
      }
    }).finally(() => setLoaded(true))
  }, [])

  const setThemeName = useCallback(async (name: ThemeName) => {
    setThemeNameState(name)
    await AsyncStorage.setItem(STORAGE_KEY, name)
  }, [])

  const setRestTimer = useCallback(async (seconds: number) => {
    setRestTimerState(seconds)
    await AsyncStorage.setItem(REST_TIMER_KEY, String(seconds))
  }, [])

  if (!loaded) return null

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        theme: themes[themeName],
        colors: themes[themeName].colors,
        setThemeName,
        restTimer,
        setRestTimer,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
