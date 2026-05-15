import { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, Vibration } from "react-native"
import { createAudioPlayer } from "expo-audio"

import { useTheme } from "@/hooks/use-theme"
import { spacing, typography, radii } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"

const beepSource = require("@/assets/audio/beep.wav")

interface Props {
  visible: boolean
  restDuration: number
  onTimerEnd: () => void
  onClose?: () => void
}

export default function RestTimer({ visible, restDuration, onTimerEnd, onClose }: Props) {
  const { colors } = useTheme()
  const [timeLeft, setTimeLeft] = useState(restDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [countdownActive, setCountdownActive] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const playerRef = useRef<ReturnType<typeof createAudioPlayer> | null>(null)

  useEffect(() => {
    try {
      const player = createAudioPlayer(beepSource)
      player.volume = 1.0
      playerRef.current = player
    } catch {}
    return () => {
      playerRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    if (!visible) {
      setIsRunning(false)
      setCountdownActive(false)
      setTimeLeft(restDuration)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [visible, restDuration])

  useEffect(() => {
    if (!countdownActive) return

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setCountdownActive(false)
          setIsRunning(false)
          onTimerEnd()
          return 0
        }

        if (prev <= 4) {
          Vibration.vibrate(100)
          const p = playerRef.current
          if (p) {
            p.seekTo(0).then(() => p.play()).catch(() => {})
          }
        }

        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [countdownActive, onTimerEnd])

  function toggleTimer() {
    if (isRunning) {
      setCountdownActive(false)
      setIsRunning(false)
    } else {
      setCountdownActive(true)
      setIsRunning(true)
    }
  }

  function adjustTime(seconds: number) {
    setTimeLeft((prev) => Math.max(0, Math.min(prev + seconds, 600)))
  }

  function handleClose() {
    setCountdownActive(false)
    setIsRunning(false)
    setTimeLeft(restDuration)
    onClose?.()
  }

  if (!visible) return null

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>Descanso</Text>
        <HapticButton onPress={handleClose}>
          <Text style={[styles.closeBtn, { color: colors.textMuted }]}>✕</Text>
        </HapticButton>
      </View>

      <Text style={[styles.timer, { color: "#00BCD4" }]}>{formatted}</Text>

      <View style={styles.controls}>
        <HapticButton
          style={[styles.adjustBtn, { borderColor: colors.border }]}
          onPress={() => adjustTime(-10)}
        >
          <Text style={[styles.adjustBtnText, { color: colors.text }]}>-10s</Text>
        </HapticButton>

        <HapticButton
          style={[
            styles.startBtn,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
            },
          ]}
          onPress={toggleTimer}
        >
          <Text style={styles.startBtnText}>
            {isRunning ? "PAUSAR" : "INICIAR DESCANSO"}
          </Text>
        </HapticButton>

        <HapticButton
          style={[styles.adjustBtn, { borderColor: colors.border }]}
          onPress={() => adjustTime(10)}
        >
          <Text style={[styles.adjustBtnText, { color: colors.text }]}>+10s</Text>
        </HapticButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "600",
    letterSpacing: 1,
  },
  closeBtn: {
    fontSize: 18,
    padding: spacing.xs,
  },
  timer: {
    fontSize: 48,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    letterSpacing: 2,
  },
  controls: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  adjustBtn: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  adjustBtnText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "600",
  },
  startBtn: {
    borderRadius: 24,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  startBtnText: {
    color: "#fff",
    fontSize: typography.body.fontSize,
    fontWeight: "700",
    letterSpacing: 1,
  },
})
