import { useRef, useState } from "react"
import { Text, View, StyleSheet, Animated, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Haptics from "expo-haptics"
import Swipeable from "react-native-gesture-handler/Swipeable"

import { useTheme } from "@/hooks/use-theme"
import { typography } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"
import type { Workout } from "@/constants/types"

interface Props {
  workout: Workout
  onPress: () => void
  onRename: () => void
  onDelete: () => void
  onOpenChange?: (swipeable: Swipeable | null) => void
}

export default function WorkoutCard({ workout, onPress, onRename, onDelete, onOpenChange }: Props) {
  const swipeableRef = useRef<Swipeable>(null)
  const [swiped, setSwiped] = useState(false)
  const { colors } = useTheme()

  const formattedDate = new Date(workout.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    _dragX: Animated.AnimatedInterpolation<number>,
  ) => (
    <View style={[styles.actionsContainer, { backgroundColor: colors.backgroundSecondary }]}>
      <HapticButton
        style={[styles.actionBtn, styles.renameBtn, { backgroundColor: colors.backgroundSecondary }]}
        onPress={() => { swipeableRef.current?.close(); onRename() }}
      >
        <Text style={styles.actionIcon}>✏️</Text>
        <Text style={[styles.actionText, { color: colors.text }]}>Renombrar</Text>
      </HapticButton>
      <HapticButton
        style={[styles.actionBtn, styles.deleteBtn]}
        onPress={() => { swipeableRef.current?.close(); onDelete() }}
      >
        <Text style={styles.actionIcon}>🗑️</Text>
        <Text style={[styles.actionText, { color: "#fff" }]}>Eliminar</Text>
      </HapticButton>
    </View>
  )

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      onSwipeableWillOpen={() => {
        setSwiped(true)
        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      }}
      onSwipeableOpen={(_dir, swipeable) => onOpenChange?.(swipeable)}
      onSwipeableClose={() => {
        setSwiped(false)
        onOpenChange?.(null)
      }}
    >
      <HapticButton
        style={[styles.card, styles.shadow, { backgroundColor: colors.surface, shadowColor: colors.shadow }, swiped ? styles.cardSwiped : styles.cardResting]}
        onPress={onPress}
        onLongPress={() => swipeableRef.current?.openRight()}
        activeOpacity={0.7}
        hapticStyle={Haptics.ImpactFeedbackStyle.Light}
      >
        <LinearGradient
          colors={[colors.primary, colors.success]}
          style={styles.accent}
        />
        <View style={styles.body}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {workout.name}
          </Text>
          <Text style={[styles.date, { color: colors.textDate }]}>{formattedDate}</Text>
        </View>
        <Text style={[styles.chevron, { color: colors.border }]}>›</Text>
      </HapticButton>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  cardResting: {
    borderRadius: 14,
  },
  cardSwiped: {
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  shadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
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
    marginBottom: 4,
  },
  date: {
    fontSize: typography.captionSmall.fontSize,
  },
  chevron: {
    fontSize: 22,
    marginRight: 16,
    fontWeight: "300",
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 12,
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
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
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
    fontSize: 11,
    fontWeight: "600",
  },
})
