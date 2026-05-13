import { View, Text, StyleSheet } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

import { colors, typography } from "../theme"
import type { RootStackParamList } from "../navigation/types"

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutDetail">

export default function WorkoutDetailScreen({ route }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Workout #{route.params.workoutId}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  text: { fontSize: 18, color: colors.textSecondary },
})
