import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Platform, View } from "react-native"

import { ThemeProvider, useTheme } from "./src/context/ThemeContext"
import { DatabaseProvider } from "./src/context/DatabaseContext"
import { DevProvider } from "./src/dev/DevProvider"
import Navigator from "./src/navigation/Navigator"

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
