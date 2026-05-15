import type { ThemeName } from "@/constants/theme"

export const DEFAULTS = {
  themeName: "negroNeon" as ThemeName,
  restTimer: 90,
  defaultWeight: 20,
  decimalStep: 0.25,
} as const

export const VALID_THEMES: ThemeName[] = ["negroNeon", "azul"]
export const VALID_REST_TIMERS = __DEV__ ? [10, 60, 90, 120] : [60, 90, 120]
export const DEFAULT_WEIGHT_OPTIONS = [10, 15, 20, 25, 30, 40, 50, 60]
export const DECIMAL_STEP_OPTIONS = [0.05, 0.10, 0.20, 0.25, 0.50]
