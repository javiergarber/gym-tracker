import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { themes, type ThemeName, type Theme, type ThemeColors } from "@/constants/theme"
import { DEFAULTS, VALID_THEMES, VALID_REST_TIMERS, DECIMAL_STEP_OPTIONS } from "@/constants/defaults"

const STORAGE_KEY = "theme"
const REST_TIMER_KEY = "restTimer"
const DEFAULT_WEIGHT_KEY = "defaultWeight"
const DECIMAL_STEP_KEY = "decimalStep"
const EXTRA_MOTIVATION_SOUNDS_KEY = "extraMotivationSounds"
const REST_END_SOUND_KEY = "restEndSound"

interface ThemeContextValue {
  themeName: ThemeName
  theme: Theme
  colors: ThemeColors
  setThemeName: (name: ThemeName) => Promise<void>
  restTimer: number
  setRestTimer: (seconds: number) => Promise<void>
  defaultWeight: number
  setDefaultWeight: (weight: number) => Promise<void>
  decimalStep: number
  setDecimalStep: (step: number) => Promise<void>
  extraMotivationSoundsEnabled: boolean
  setExtraMotivationSoundsEnabled: (enabled: boolean) => Promise<void>
  restEndSoundEnabled: boolean
  setRestEndSoundEnabled: (enabled: boolean) => Promise<void>
  resetToDefaults: () => Promise<void>
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>(DEFAULTS.themeName)
  const [restTimer, setRestTimerState] = useState<number>(DEFAULTS.restTimer)
  const [defaultWeight, setDefaultWeightState] = useState<number>(DEFAULTS.defaultWeight)
  const [decimalStep, setDecimalStepState] = useState<number>(DEFAULTS.decimalStep)
  const [extraMotivationSoundsEnabled, setExtraMotivationSoundsEnabledState] = useState<boolean>(DEFAULTS.extraMotivationSoundsEnabled)
  const [restEndSoundEnabled, setRestEndSoundEnabledState] = useState<boolean>(DEFAULTS.restEndSoundEnabled)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (VALID_THEMES.includes(saved as ThemeName)) {
        setThemeNameState(saved as ThemeName)
      }
    })
    AsyncStorage.getItem(REST_TIMER_KEY).then((saved) => {
      if (saved) {
        const num = Number(saved)
        if (VALID_REST_TIMERS.includes(num)) {
          setRestTimerState(num)
        }
      }
    })
    AsyncStorage.getItem(DEFAULT_WEIGHT_KEY).then((saved) => {
      if (saved) {
        const num = Number(saved)
        if (!isNaN(num) && num > 0) {
          setDefaultWeightState(num)
        }
      }
    })
    AsyncStorage.getItem(DECIMAL_STEP_KEY).then((saved) => {
      if (saved) {
        const num = Number(saved)
        if (DECIMAL_STEP_OPTIONS.includes(num)) {
          setDecimalStepState(num)
        }
      }
    })
    AsyncStorage.getItem(EXTRA_MOTIVATION_SOUNDS_KEY).then((saved) => {
      if (saved !== null) {
        setExtraMotivationSoundsEnabledState(saved === "true")
      }
    })
    AsyncStorage.getItem(REST_END_SOUND_KEY).then((saved) => {
      if (saved !== null) {
        setRestEndSoundEnabledState(saved === "true")
      }
    }).finally(() => setLoaded(true))
  }, [])

  const resetToDefaults = useCallback(async () => {
    setThemeNameState(DEFAULTS.themeName)
    setRestTimerState(DEFAULTS.restTimer as number)
    setDefaultWeightState(DEFAULTS.defaultWeight as number)
    setDecimalStepState(DEFAULTS.decimalStep as number)
    setExtraMotivationSoundsEnabledState(DEFAULTS.extraMotivationSoundsEnabled)
    setRestEndSoundEnabledState(DEFAULTS.restEndSoundEnabled)
    await AsyncStorage.multiSet([
      [STORAGE_KEY, DEFAULTS.themeName],
      [REST_TIMER_KEY, String(DEFAULTS.restTimer)],
      [DEFAULT_WEIGHT_KEY, String(DEFAULTS.defaultWeight)],
      [DECIMAL_STEP_KEY, String(DEFAULTS.decimalStep)],
      [EXTRA_MOTIVATION_SOUNDS_KEY, String(DEFAULTS.extraMotivationSoundsEnabled)],
      [REST_END_SOUND_KEY, String(DEFAULTS.restEndSoundEnabled)],
    ])
  }, [])

  const setThemeName = useCallback(async (name: ThemeName) => {
    setThemeNameState(name)
    await AsyncStorage.setItem(STORAGE_KEY, name)
  }, [])

  const setRestTimer = useCallback(async (seconds: number) => {
    setRestTimerState(seconds)
    await AsyncStorage.setItem(REST_TIMER_KEY, String(seconds))
  }, [])

  const setDefaultWeight = useCallback(async (weight: number) => {
    setDefaultWeightState(weight)
    await AsyncStorage.setItem(DEFAULT_WEIGHT_KEY, String(weight))
  }, [])

  const setDecimalStep = useCallback(async (step: number) => {
    setDecimalStepState(step)
    await AsyncStorage.setItem(DECIMAL_STEP_KEY, String(step))
  }, [])

  const setExtraMotivationSoundsEnabled = useCallback(async (enabled: boolean) => {
    setExtraMotivationSoundsEnabledState(enabled)
    await AsyncStorage.setItem(EXTRA_MOTIVATION_SOUNDS_KEY, String(enabled))
  }, [])

  const setRestEndSoundEnabled = useCallback(async (enabled: boolean) => {
    setRestEndSoundEnabledState(enabled)
    await AsyncStorage.setItem(REST_END_SOUND_KEY, String(enabled))
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
        defaultWeight,
        setDefaultWeight,
        decimalStep,
        setDecimalStep,
        extraMotivationSoundsEnabled,
        setExtraMotivationSoundsEnabled,
        restEndSoundEnabled,
        setRestEndSoundEnabled,
        resetToDefaults,
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
