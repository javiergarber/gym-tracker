import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, View, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

import { useTheme } from "../context/ThemeContext"
import { spacing, typography, radii } from "../tokens"
import { getWorkoutById, getWorkoutDays } from "../services/database"
import HapticButton from "../components/HapticButton"
import type { RootStackParamList } from "../navigation/types"

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutDetail">

interface Day {
  id: number
  workout_id: number
  name: string
  subtitle: string | null
  sort_order: number
}

export default function WorkoutDetailScreen({ route, navigation }: Props) {
  const { colors } = useTheme()
  const [workoutName, setWorkoutName] = useState("")
  const [days, setDays] = useState<Day[]>([])

  useEffect(() => {
    ;(async () => {
      const workout = await getWorkoutById(route.params.workoutId)
      if (workout) {
        setWorkoutName(workout.name)
        navigation.setOptions({ title: workout.name })
      }
      const daysData = await getWorkoutDays(route.params.workoutId)
      setDays(daysData as Day[])
    })()
  }, [route.params.workoutId])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {days.map((day, index) => (
          <HapticButton
            key={day.id}
            style={[styles.dayCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate("DayDetail", { dayId: day.id })}
          >
            <LinearGradient
              colors={[colors.primary, colors.success]}
              style={styles.accent}
              start={{ x: 0.5, y: -index }}
              end={{ x: 0.5, y: days.length - index }}
            />
            <View style={styles.dayBody}>
              <Text style={[styles.dayName, { color: colors.text }]}>{day.name}</Text>
              {day.subtitle && (
                <Text style={[styles.daySubtitle, { color: colors.textSecondary }]}>{day.subtitle}</Text>
              )}
            </View>
            <Text style={[styles.chevron, { color: colors.border }]}>›</Text>
          </HapticButton>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
  },
  dayCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    borderRadius: radii.lg,
    overflow: "hidden",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
      },
    }),
  },
  accent: {
    width: 5,
    alignSelf: "stretch",
  },
  dayBody: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  dayName: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
  },
  daySubtitle: {
    fontSize: typography.caption.fontSize,
    marginTop: spacing.xs,
  },
  chevron: {
    fontSize: 22,
    marginRight: spacing.lg,
    fontWeight: "300",
  },
})
