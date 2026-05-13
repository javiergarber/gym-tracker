import { StatusBar } from "expo-status-bar"
import { NavigationContainer } from "@react-navigation/native"
import { View } from "react-native"

import { DatabaseProvider } from "./src/context/DatabaseContext"
import Navigator from "./src/navigation/Navigator"

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <DatabaseProvider>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </DatabaseProvider>
    </View>
  )
}
