import { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, Modal, Pressable, Vibration } from "react-native"

import { useTheme } from "@/hooks/use-theme"
import { spacing, typography, radii } from "@/constants/tokens"
import { VALID_REST_TIMERS } from "@/constants/defaults"
import HapticButton from "@/components/haptic-button"

interface Props {
  elapsed: number
  paused: boolean
  restDuration: number
  restTrigger: number
  onRestDurationChange: (seconds: number) => void
  onRestEnd: () => void
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function formatShort(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

export default function TimerDisplay({ elapsed, paused, restDuration, restTrigger, onRestDurationChange, onRestEnd }: Props) {
  const { colors } = useTheme()
  const [timeLeft, setTimeLeft] = useState(restDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [showRestPicker, setShowRestPicker] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeLeftRef = useRef(restDuration)

  useEffect(() => {
    if (restTrigger <= 0) return
    clearTimer()
    timeLeftRef.current = restDuration
    setTimeLeft(restDuration)
    setIsRunning(false)
  }, [restTrigger, restDuration])

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      const next = timeLeftRef.current - 1

      if (next <= 0) {
        timeLeftRef.current = 0
        setTimeLeft(0)
        clearTimer()
        setIsRunning(false)
        setTimeout(() => {
          Vibration.vibrate(300)
          timeLeftRef.current = restDuration
          setTimeLeft(restDuration)
        }, 200)
        onRestEnd()
        return
      }

      timeLeftRef.current = next
      setTimeLeft(next)

      if (next <= 3) {
        Vibration.vibrate(100)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, onRestEnd])

  function clearTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function toggleRest() {
    if (isRunning) {
      clearTimer()
      setIsRunning(false)
      timeLeftRef.current = restDuration
      setTimeLeft(restDuration)
    } else {
      if (timeLeft <= 0) {
        timeLeftRef.current = restDuration
        setTimeLeft(restDuration)
      }
      setIsRunning(true)
    }
  }

  function handlePickerSelect(sec: number) {
    setShowRestPicker(false)
    onRestDurationChange(sec)
    timeLeftRef.current = sec
    setTimeLeft(sec)
    clearTimer()
    setIsRunning(false)
  }

  return (
    <View style={styles.timerSection}>
      <Text style={[styles.timerLabel, { color: paused ? colors.textSecondary : colors.textTertiary }]}>
        {paused ? "EN PAUSA" : "TIEMPO TOTAL"}
      </Text>
      <Text style={[styles.timerValue, { color: colors.primary }]}>
        {formatTime(elapsed)}
      </Text>

      <HapticButton
        style={[styles.restToggleBtn, { backgroundColor: colors.primary }]}
        onPress={toggleRest}
      >
        <Text style={styles.restToggleIcon}>{isRunning ? "■" : "▶"}</Text>
        <Text style={styles.restToggleText}>
          {isRunning ? "Acabar descanso" : "Iniciar descanso"}
        </Text>
      </HapticButton>

      <View style={styles.restInfoRow}>
        <Text style={[styles.restIcon, { color: "#00BCD4" }]}>⏱</Text>
        <Text style={[styles.restTime, { color: "#00BCD4" }]}>
          Descanso: {formatShort(timeLeft)}
        </Text>
        <HapticButton style={styles.gearBtn} onPress={() => setShowRestPicker(true)}>
          <Text style={[styles.gearIcon, { color: colors.textMuted }]}>⚙</Text>
        </HapticButton>
      </View>

      <Modal visible={showRestPicker} transparent animationType="fade">
        <Pressable style={styles.pickerOverlay} onPress={() => setShowRestPicker(false)}>
          <View style={[styles.pickerContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.pickerTitle, { color: colors.text }]}>Duración del descanso</Text>
            {VALID_REST_TIMERS.map((sec) => (
              <HapticButton
                key={sec}
                style={[
                  styles.pickerOption,
                  {
                    backgroundColor: restDuration === sec ? colors.primary : "transparent",
                    borderColor: restDuration === sec ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => handlePickerSelect(sec)}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    { color: restDuration === sec ? "#fff" : colors.text },
                  ]}
                >
                  {sec / 60 > 1 ? `${sec / 60} min` : `${sec} s`}
                </Text>
              </HapticButton>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  timerSection: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  timerLabel: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: -spacing.md,
  },
  timerValue: {
    fontSize: 72,
    fontFamily: "Roboto_700Bold",
    fontVariant: ["tabular-nums"],
    letterSpacing: 2,
  },
  restToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: 20,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  restToggleIcon: {
    fontSize: 14,
    color: "#fff",
  },
  restToggleText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  restInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  restIcon: {
    fontSize: 16,
  },
  restTime: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  gearBtn: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  gearIcon: {
    fontSize: 18,
  },
  pickerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContent: {
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.xl,
    width: "80%",
    maxWidth: 300,
    gap: spacing.md,
  },
  pickerTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    marginBottom: spacing.sm,
  },
  pickerOption: {
    borderRadius: radii.md,
    borderWidth: 1.5,
    paddingVertical: 14,
    alignItems: "center",
  },
  pickerOptionText: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
})
