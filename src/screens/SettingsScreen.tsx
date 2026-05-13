import { View, Text, StyleSheet } from "react-native"

import { colors, typography } from "../theme"

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ajustes</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  text: { fontSize: 18, color: colors.textSecondary },
})
