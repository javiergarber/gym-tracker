import { View, Text, StyleSheet } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

import { useTheme } from "../context/ThemeContext"
import { typography } from "../tokens"
import type { RootStackParamList } from "../navigation/types"

type Props = NativeStackScreenProps<RootStackParamList, "DayDetail">

export default function DayDetailScreen({ route }: Props) {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>Day #{route.params.dayId}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
})
