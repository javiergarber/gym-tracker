import { useEffect, useRef } from "react"
import { Modal, View, Text, StyleSheet, Animated, Dimensions } from "react-native"

import { useTheme } from "@/hooks/use-theme"
import { spacing, typography, radii } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const CONFETTI_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#FFD700"]

interface ConfettiPiece {
  x: number
  delay: number
  color: string
  size: number
  animation: Animated.Value
}

function createConfetti(): ConfettiPiece[] {
  return Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * SCREEN_WIDTH,
    delay: Math.random() * 1000,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 6 + Math.random() * 8,
    animation: new Animated.Value(-20),
  }))
}

function Confetti() {
  const pieces = useRef<ConfettiPiece[]>(createConfetti()).current

  useEffect(() => {
    Animated.stagger(
      60,
      pieces.map((p) =>
        Animated.timing(p.animation, {
          toValue: Dimensions.get("window").height + 20,
          duration: 2500 + Math.random() * 1500,
          useNativeDriver: true,
          delay: p.delay,
        }),
      ),
    ).start()
  }, [pieces])

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.confettiPiece,
            {
              left: p.x,
              width: p.size,
              height: p.size * 0.6,
              backgroundColor: p.color,
              transform: [{ translateY: p.animation }, { rotate: `${Math.random() * 360}deg` }],
            },
          ]}
        />
      ))}
    </View>
  )
}

interface Props {
  visible: boolean
  totalTime: number
  onGoBack: () => void
  exerciseCount: number
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export default function CompletionModal({ visible, totalTime, onGoBack, exerciseCount }: Props) {
  const { colors } = useTheme()

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        {visible && <Confetti />}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={styles.emoji}>🎉</Text>
          <Text style={[styles.title, { color: colors.text }]}>Entrenamiento completado</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            ¡Buen trabajo! Has completado {exerciseCount} ejercicio{exerciseCount !== 1 ? "s" : ""}.
          </Text>

          <View style={[styles.statRow, { backgroundColor: colors.background }]}>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Tiempo total</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{formatTime(totalTime)}</Text>
          </View>

          <Text style={[styles.reminder, { color: colors.textTertiary }]}>
            No olvides estirar después del entrenamiento.
          </Text>

          <HapticButton style={[styles.goBackBtn, { backgroundColor: colors.primary }]} onPress={onGoBack}>
            <Text style={styles.goBackBtnText}>Volver</Text>
          </HapticButton>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  card: {
    borderRadius: radii.xl,
    padding: spacing.xxl,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    gap: spacing.md,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    textAlign: "center",
    lineHeight: 22,
  },
  statRow: {
    width: "100%",
    borderRadius: radii.md,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: typography.bodySmall.fontSize,
  },
  statValue: {
    fontSize: typography.h3.fontSize,
    fontWeight: "700",
  },
  reminder: {
    fontSize: typography.captionSmall.fontSize,
    textAlign: "center",
    fontStyle: "italic",
  },
  goBackBtn: {
    width: "100%",
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  goBackBtnText: {
    color: "#fff",
    fontSize: typography.h3.fontSize,
    fontWeight: "700",
  },
  confettiPiece: {
    position: "absolute",
    top: 0,
    borderRadius: 2,
  },
})
