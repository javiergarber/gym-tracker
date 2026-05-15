import { useMemo, useEffect, useCallback } from "react"
import { StatusBar } from "expo-status-bar"
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Platform, View } from "react-native"
import * as SplashScreen from "expo-splash-screen"
import { useFonts, Roboto_700Bold } from "@expo-google-fonts/roboto"

import { ThemeProvider, useTheme } from "@/hooks/use-theme"
import { DatabaseProvider } from "@/hooks/use-database"
import { DevProvider } from "@/hooks/dev-provider"
import Navigator from "@/app/navigator"

const Root = Platform.OS === "web" ? View : GestureHandlerRootView

SplashScreen.preventAutoHideAsync()

function StatusBarWrapper() {
  const { theme } = useTheme()

  useEffect(() => {
    if (Platform.OS === "android") {
      try {
        const { setBackgroundColorAsync } = require("expo-system-ui") as {
          setBackgroundColorAsync: (color: string) => Promise<void>
        }
        setBackgroundColorAsync(theme.colors.background)
      } catch {}
    }
  }, [theme.colors.background])

  return <StatusBar style={theme.dark ? "light" : "dark"} />
}

function ThemedNavigationContainer({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()

  const navTheme = useMemo(
    () => ({
      ...(theme.dark ? DarkTheme : DefaultTheme),
      colors: {
        ...(theme.dark ? DarkTheme.colors : DefaultTheme.colors),
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        primary: theme.colors.primary,
      },
    }),
    [theme],
  )

  return <NavigationContainer theme={navTheme}>{children}</NavigationContainer>
}

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_700Bold })
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <Root style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ThemeProvider>
        <StatusBarWrapper />
        <DatabaseProvider>
          <DevProvider>
            <ThemedNavigationContainer>
              <Navigator />
            </ThemedNavigationContainer>
          </DevProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </Root>
  )
}
