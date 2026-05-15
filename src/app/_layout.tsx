import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Platform, View } from "react-native"

import { ThemeProvider, useTheme } from "@/hooks/use-theme"
import { DatabaseProvider } from "@/hooks/use-database"
import { DevProvider } from "@/hooks/dev-provider"
import Navigator from "@/app/navigator"

const Root = Platform.OS === "web" ? View : GestureHandlerRootView

function StatusBarWrapper() {
  const { theme } = useTheme()
  return <StatusBar style={theme.dark ? "light" : "dark"} />
}

export default function App() {
  return (
    <Root style={{ flex: 1 }}>
      <ThemeProvider>
        <StatusBarWrapper />
        <DatabaseProvider>
          <DevProvider>
            <NavigationContainer>
              <Navigator />
            </NavigationContainer>
          </DevProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </Root>
  )
}
