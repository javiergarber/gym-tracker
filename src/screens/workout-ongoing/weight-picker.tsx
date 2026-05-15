import { useRef, useCallback, useEffect, useMemo } from "react"
import { View, Text, ScrollView, StyleSheet, Dimensions, Platform } from "react-native"
import * as Haptics from "expo-haptics"

import { useTheme } from "@/hooks/use-theme"
import { spacing, typography, radii } from "@/constants/tokens"

const ITEM_HEIGHT = 36
const VISIBLE_ITEMS = 5
const COLUMN_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS

const INTEGERS = Array.from({ length: 201 }, (_, i) => i)

interface Props {
  weight: number
  onWeightChange: (weight: number) => void
}

export default function WeightPicker({ weight, onWeightChange }: Props) {
  const { colors, decimalStep } = useTheme()
  const intRef = useRef<ScrollView>(null)
  const decRef = useRef<ScrollView>(null)

  const decimals = useMemo(() => {
    const steps = Math.round(1 / decimalStep)
    return Array.from({ length: steps }, (_, i) => {
      const val = i * decimalStep
      return "." + val.toFixed(2).split(".")[1]
    })
  }, [decimalStep])

  const integerPart = Math.floor(weight)
  const decimalPart = Math.round((weight - integerPart) * 100)
  const lastIntIndex = useRef(-1)
  const lastDecIndex = useRef(-1)

  useEffect(() => {
    const intIndex = integerPart
    const decIndex = decimals.indexOf("." + String(decimalPart).padStart(2, "0"))
    if (intIndex >= 0) {
      intRef.current?.scrollTo({ y: intIndex * ITEM_HEIGHT, animated: false })
    }
    if (decIndex >= 0) {
      decRef.current?.scrollTo({ y: decIndex * ITEM_HEIGHT, animated: false })
    }
  }, [integerPart, decimalPart, decimals])

  const handleIntMomentumEnd = useCallback(
    (e: any) => {
      const offsetY = e.nativeEvent.contentOffset.y
      const index = Math.round(offsetY / ITEM_HEIGHT)
      const clamped = Math.max(0, Math.min(index, INTEGERS.length - 1))
      const newWeight = clamped + decimalPart / 100
      onWeightChange(newWeight)
    },
    [decimalPart, onWeightChange],
  )

  const handleIntScroll = useCallback(
    (e: any) => {
      const offsetY = e.nativeEvent.contentOffset.y
      const index = Math.round(offsetY / ITEM_HEIGHT)
      const clamped = Math.max(0, Math.min(index, INTEGERS.length - 1))
      if (clamped !== lastIntIndex.current && Platform.OS !== "web") {
        lastIntIndex.current = clamped
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    },
    [],
  )

  const handleDecMomentumEnd = useCallback(
    (e: any) => {
      const offsetY = e.nativeEvent.contentOffset.y
      const index = Math.round(offsetY / ITEM_HEIGHT)
      const clamped = Math.max(0, Math.min(index, decimals.length - 1))
      const dec = Math.round(parseFloat(decimals[clamped]) * 100)
      const newWeight = integerPart + dec / 100
      onWeightChange(newWeight)
    },
    [integerPart, decimals, onWeightChange],
  )

  const handleDecScroll = useCallback(
    (e: any) => {
      const offsetY = e.nativeEvent.contentOffset.y
      const index = Math.round(offsetY / ITEM_HEIGHT)
      const clamped = Math.max(0, Math.min(index, decimals.length - 1))
      if (clamped !== lastDecIndex.current && Platform.OS !== "web") {
        lastDecIndex.current = clamped
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    },
    [decimals],
  )

  return (
    <View style={[styles.mainBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.accent }]}>PESO (KG)</Text>
      </View>

      <View style={{ height: spacing.sm }} />

      <View style={styles.pickerContainer}>
        <ScrollView
          ref={intRef}
          style={[styles.column, { borderColor: colors.border }]}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={handleIntScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleIntMomentumEnd}
          contentContainerStyle={{
            paddingTop: COLUMN_HEIGHT / 2 - ITEM_HEIGHT / 2,
            paddingBottom: COLUMN_HEIGHT / 2 - ITEM_HEIGHT / 2,
          }}
        >
          {INTEGERS.map((value) => (
            <View key={value} style={styles.item}>
              <Text style={[styles.itemText, { color: value === integerPart ? colors.accent : colors.textMuted }]}>
                {value}
              </Text>
              {value !== integerPart && <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />}
            </View>
          ))}
        </ScrollView>

        <View style={{ width: spacing.xs }} />

        <ScrollView
          ref={decRef}
          style={[styles.column, styles.columnSmall, { borderColor: colors.border }]}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={handleDecScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleDecMomentumEnd}
          contentContainerStyle={{
            paddingTop: COLUMN_HEIGHT / 2 - ITEM_HEIGHT / 2,
            paddingBottom: COLUMN_HEIGHT / 2 - ITEM_HEIGHT / 2,
          }}
        >
          {decimals.map((value) => {
            const isSelected = value === "." + String(decimalPart).padStart(2, "0")
            return (
              <View key={value} style={styles.item}>
                <Text style={[styles.itemText, styles.itemTextSmall, { color: isSelected ? colors.accent : colors.textMuted }]}>
                  {value}
                </Text>
                {!isSelected && <View style={[styles.itemDivider, { backgroundColor: colors.border }]} />}
              </View>
            )
          })}
        </ScrollView>
        <View pointerEvents="none" style={[styles.selectedHighlight, { borderColor: colors.primary }]} />
      </View>

      <View style={[styles.weightBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.weightValue, { color: colors.accent }]}>
          {weight.toFixed(2)} <Text style={[styles.weightUnit, { color: colors.textMuted }]}>KG</Text>
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainBox: {
    borderWidth: 1,
    borderRadius: radii.xl,
    padding: spacing.md,
    paddingTop: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: COLUMN_HEIGHT,
    position: "relative",
  },
  selectedHighlight: {
    position: "absolute",
    top: COLUMN_HEIGHT / 2 - ITEM_HEIGHT / 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  column: {
    width: 72,
    borderWidth: 1,
    borderRadius: radii.md,
    height: COLUMN_HEIGHT,
  },
  columnSmall: {
    width: 60,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  itemDivider: {
    position: "absolute",
    bottom: 0,
    width: "75%",
    height: 1,
    left: "12.5%",
  },
  itemText: {
    fontSize: typography.body.fontSize,
    fontWeight: "700",
  },
  itemTextSmall: {
    fontSize: typography.caption.fontSize,
  },
  weightBox: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  weightValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  weightUnit: {
    fontSize: 14,
    fontWeight: "600",
  },
})
