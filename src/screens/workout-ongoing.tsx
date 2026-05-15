import { View, Text, StyleSheet } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

import { useTheme } from "@/hooks/use-theme"
import type { RootStackParamList } from "@/app/navigator.types"

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutOngoing">

export default function WorkoutOngoingScreen({ route }: Props) {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        Entrenamiento en curso (día #{route.params.dayId})
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18 },
})
