import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Platform, View } from "react-native"

import { DatabaseProvider } from "./src/context/DatabaseContext"
import Navigator from "./src/navigation/Navigator"

const Root = Platform.OS === "web" ? View : GestureHandlerRootView

export default function App() {
  return (
    <Root style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <DatabaseProvider>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </DatabaseProvider>
    </Root>
  )
}
