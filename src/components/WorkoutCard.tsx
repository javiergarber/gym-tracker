import { useRef } from "react"
import { TouchableOpacity, Text, View, StyleSheet, Animated } from "react-native"
import Swipeable from "react-native-gesture-handler/Swipeable"

import { colors, typography } from "../theme"
import type { Workout } from "../types"

interface Props {
  workout: Workout
  onPress: () => void
  onRename: () => void
  onDelete: () => void
  onOpenChange?: (swipeable: Swipeable | null) => void
}

const ACCENT_COLORS = ["#007AFF", "#34C759", "#FF9500", "#FF3B30", "#AF52DE", "#5AC8FA", "#FF2D55"]

export default function WorkoutCard({ workout, onPress, onRename, onDelete, onOpenChange }: Props) {
  const swipeableRef = useRef<Swipeable>(null)
  const colorIndex = workout.id % ACCENT_COLORS.length
  const accentColor = ACCENT_COLORS[colorIndex]

  const formattedDate = new Date(workout.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    _dragX: Animated.AnimatedInterpolation<number>,
  ) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionBtn, styles.renameBtn]}
        onPress={() => { swipeableRef.current?.close(); onRename() }}
      >
        <Text style={styles.actionIcon}>✏️</Text>
        <Text style={styles.actionText}>Renombrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionBtn, styles.deleteBtn]}
        onPress={() => { swipeableRef.current?.close(); onDelete() }}
      >
        <Text style={styles.actionIcon}>🗑️</Text>
        <Text style={styles.actionText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      onSwipeableOpen={(_dir, swipeable) => onOpenChange?.(swipeable)}
      onSwipeableClose={() => onOpenChange?.(null)}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onLongPress={() => swipeableRef.current?.openRight()}
        activeOpacity={0.7}
      >
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {workout.name}
          </Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
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
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#e8e8e8",
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  actionBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    paddingVertical: 4,
  },
  renameBtn: {
    backgroundColor: "transparent",
  },
  deleteBtn: {
    backgroundColor: "#FF3B30",
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  actionIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  actionText: {
    color: "#666",
    fontSize: 11,
    fontWeight: "600",
  },
})
