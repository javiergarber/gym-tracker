import { TouchableOpacity, Text, View, StyleSheet } from "react-native"

import { colors, typography } from "../theme"
import type { Workout } from "../types"

interface Props {
  workout: Workout
  onPress: () => void
}

const ACCENT_COLORS = ["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#AF52DE", "#5AC8FA", "#FF2D55"]

export default function WorkoutCard({ workout, onPress }: Props) {
  const colorIndex = workout.id % ACCENT_COLORS.length
  const accentColor = ACCENT_COLORS[colorIndex]

  const formattedDate = new Date(workout.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {workout.name}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  accent: {
    width: 5,
    alignSelf: "stretch",
  },
  body: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: typography.captionSmall.fontSize,
    color: colors.textDate,
  },
  chevron: {
    fontSize: 22,
    color: colors.border,
    marginRight: 16,
    fontWeight: "300",
  },
})
