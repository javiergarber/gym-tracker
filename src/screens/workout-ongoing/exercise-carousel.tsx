import { useRef, useCallback, useState, useEffect } from "react"
import { View, Text, FlatList, StyleSheet, Dimensions, Platform } from "react-native"
import * as Haptics from "expo-haptics"

import { useTheme } from "@/hooks/use-theme"
import { spacing, typography, radii } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"
import type { ExerciseWithSets } from "@/constants/types"

const SCREEN_WIDTH = Dimensions.get("window").width
const CARD_WIDTH = SCREEN_WIDTH * 0.7
const CARD_GAP = spacing.sm

interface Props {
  exercises: ExerciseWithSets[]
  currentIndex: number
  onIndexChange: (index: number) => void
  loggedSetsData?: Record<number, { weight: number; rirLabel: string }[]>
  completedExercises?: Set<number>
  previousWeights?: Record<number, { weight: number; rirLabel: string }[]>
}

function formatSets(exercise: ExerciseWithSets): string {
  const allReps = exercise.sets.map((s) => s.reps?.trim()).filter(Boolean)
  if (allReps.length === 0) return `${exercise.sets.length} series`
  const uniqueReps = [...new Set(allReps)]
  return uniqueReps.length === 1
    ? `${exercise.sets.length}x${uniqueReps[0]}`
    : `${exercise.sets.length}x${allReps.join(",")}`
}

function formatLoggedEntry(weight: number, rirLabel: string): string {
  const suffix =
    rirLabel === "fallo" ? "!" :
    rirLabel === "rir1-2" ? "+" :
    rirLabel === "rir3+" ? "*" :
    ""
  const formatted = String(weight).replace(".", ",")
  return suffix ? `${formatted}${suffix}` : formatted
}

export default function ExerciseCarousel({ exercises, currentIndex, onIndexChange, loggedSetsData, completedExercises, previousWeights }: Props) {
  const { colors } = useTheme()
  const listRef = useRef<FlatList>(null)
  const [scrollX, setScrollX] = useState(0)
  const [cardHeight, setCardHeight] = useState(0)

  const scrollToIndex = useCallback((index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 })
  }, [])

  useEffect(() => {
    scrollToIndex(currentIndex)
  }, [currentIndex, scrollToIndex])

  function goNext() {
    if (currentIndex < exercises.length - 1) {
      scrollToIndex(currentIndex + 1)
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1)
    }
  }

  const ITEM_STEP = CARD_WIDTH + CARD_GAP

  const onScroll = useCallback((e: any) => {
    setScrollX(e.nativeEvent.contentOffset.x)
  }, [])

  const onMomentumEnd = useCallback(
    (e: any) => {
      const offsetX = e.nativeEvent.contentOffset.x
      const index = Math.round(offsetX / ITEM_STEP)
      if (index !== currentIndex) {
        onIndexChange(index)
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
      }
    },
    [currentIndex, onIndexChange],
  )

  const viewportCenter = scrollX + SCREEN_WIDTH / 2
  const activeIndex = Math.round(scrollX / ITEM_STEP)

  return (
    <View style={styles.wrapper}>
      <View style={styles.carouselContainer}>
        <FlatList
          ref={listRef}
          data={exercises}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToOffsets={exercises.map((_, i) => i * ITEM_STEP)}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
            gap: CARD_GAP,
          }}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onMomentumEnd}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            const cardCenter = (SCREEN_WIDTH - CARD_WIDTH) / 2 + index * ITEM_STEP + CARD_WIDTH / 2
            const distFromCenter = Math.abs(cardCenter - viewportCenter)
            const stepsAway = distFromCenter / ITEM_STEP
            const scale = Math.max(0.7, 1 - stepsAway * 0.2)
            const opacity = Math.max(0.2, 1 - stepsAway * 0.4)
            const translateY = cardHeight * (1 - scale) / 2

            return (
              <View
                style={[styles.card, { backgroundColor: colors.surface, transform: [{ scale }, { translateY }], opacity }]}
                onLayout={cardHeight ? undefined : (e) => setCardHeight(e.nativeEvent.layout.height)}
              >
                <View style={styles.cardLabelRow}>
                  {index === currentIndex ? (
                    <Text style={[styles.cardLabel, { color: colors.textMuted }]}>
                      EJERCICIO ACTUAL
                    </Text>
                  ) : (
                    <View style={styles.cardLabelPlaceholder} />
                  )}
                </View>
                <Text style={[styles.exerciseName, { color: colors.text }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[styles.exerciseSeries, { color: colors.textTertiary }]}>
                  {formatSets(item)}
                </Text>
                {previousWeights?.[item.id]?.length ? (
                  <Text style={{ color: colors.textMuted, fontSize: typography.captionSmall.fontSize, marginTop: 2 }}>
                    ant: {previousWeights[item.id].map((s) => formatLoggedEntry(s.weight, s.rirLabel)).join(" · ")}
                  </Text>
                ) : null}
                <Text style={[styles.loggedWeights, { color: colors.primary }]} numberOfLines={1}>
                  {loggedSetsData?.[item.id]?.length
                    ? loggedSetsData[item.id].map((s) => formatLoggedEntry(s.weight, s.rirLabel)).join(" · ")
                    : ""}
                </Text>
                <View style={styles.dots}>
                  {exercises.map((ex, i) => {
                    const isCompleted = completedExercises?.has(ex.id) ?? false
                    const isCurrent = i === activeIndex
                    const dotColor = isCompleted ? "#4CAF50" : isCurrent ? "#FFFFFF" : colors.textMuted
                    const dotBorder = isCompleted && isCurrent ? { borderWidth: 1.5, borderColor: "#FFFFFF" } : {}
                    const dotSize = isCurrent ? styles.dotCurrent : isCompleted ? styles.dotCompleted : styles.dot
                    return (
                      <View key={i} style={styles.dotWrapper}>
                        <View style={[dotSize, { backgroundColor: dotColor }, dotBorder]} />
                      </View>
                    )
                  })}
                </View>
              </View>
            )
          }}
        />

        {currentIndex !== 0 && (
          <HapticButton
            style={[styles.arrow, styles.arrowLeft]}
            onPress={goPrev}
          >
            <Text style={[styles.arrowText, { color: colors.primary }]}>
              ◀
            </Text>
          </HapticButton>
        )}

        {currentIndex !== exercises.length - 1 && (
          <HapticButton
            style={[styles.arrow, styles.arrowRight]}
            onPress={goNext}
          >
            <Text style={[styles.arrowText, { color: colors.primary }]}>
              ▶
            </Text>
          </HapticButton>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 0,
    paddingBottom: spacing.xs,
  },
  carouselContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    marginTop: -18,
  },
  arrowLeft: {
    left: spacing.sm,
  },
  arrowRight: {
    right: spacing.sm,
  },
  arrowText: {
    fontSize: 18,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
      },
    }),
  },
  cardLabelRow: {
    height: 13,
    justifyContent: "center",
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  cardLabelPlaceholder: {
    height: 11,
  },
  exerciseName: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    marginBottom: spacing.xs,
  },
  exerciseSeries: {
    fontSize: typography.body.fontSize,
  },
  loggedWeights: {
    fontSize: typography.captionSmall.fontSize,
    fontWeight: "600",
    marginTop: spacing.xs,
    letterSpacing: 0.3,
    minHeight: 16,
    lineHeight: 16,
  },
  dots: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  dotWrapper: {
    justifyContent: "center",
    alignItems: "center",
    height: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotCompleted: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotCurrent: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
