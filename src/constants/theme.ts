export type ThemeName = "negroNeon" | "azul"

export interface ThemeColors {
  background: string
  backgroundSecondary: string
  surface: string
  primary: string
  text: string
  textSecondary: string
  textTertiary: string
  textMuted: string
  textDate: string
  border: string
  disabled: string
  overlay: string
  overlayDark: string
  shadow: string
  shadowPrimary: string
  success: string
  danger: string
}

export type Theme = {
  dark: boolean
  colors: ThemeColors
}

export const themes: Record<ThemeName, Theme> = {
  negroNeon: {
    dark: true,
    colors: {
      background: "#0A0A0F",
      backgroundSecondary: "#27272C",
      surface: "#1C1C24",
      primary: "#7C3AED",
      text: "#FFFFFF",
      textSecondary: "#D4D4D8",
      textTertiary: "#A1A1AA",
      textMuted: "#71717A",
      textDate: "#8B8B95",
      border: "#2D2D35",
      disabled: "#3F3F46",
      overlay: "rgba(0,0,0,0.6)",
      overlayDark: "rgba(0,0,0,0.8)",
      shadow: "#000",
      shadowPrimary: "#7C3AED",
      success: "#4ADE80",
      danger: "#EF4444",
    },
  },
  azul: {
    dark: false,
    colors: {
      background: "#F8FAFC",
      backgroundSecondary: "#E2E8F0",
      surface: "#FFFFFF",
      primary: "#14B8A6",
      text: "#0F172A",
      textSecondary: "#334155",
      textTertiary: "#64748B",
      textMuted: "#94A3B8",
      textDate: "#94A3B8",
      border: "#E2E8F0",
      disabled: "#CBD5E1",
      overlay: "rgba(0,0,0,0.5)",
      overlayDark: "rgba(0,0,0,0.6)",
      shadow: "#000",
      shadowPrimary: "#14B8A6",
      success: "#0A84FF",
      danger: "#EF4444",
    },
  },
}

export { spacing, typography, radii } from "./tokens"
