import { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, Modal, Pressable, Vibration, AppState, Switch } from "react-native"
import * as Notifications from "expo-notifications"

import { useTheme } from "@/hooks/use-theme"
import { useAudio } from "@/hooks/use-audio"
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

function formatRestTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  if (m === 0) return `${s}s`
  return `${m}:${String(s).padStart(2, "0")}`
}

export default function TimerDisplay({ elapsed, paused, restDuration, restTrigger, onRestDurationChange, onRestEnd }: Props) {
  const { colors, restEndSoundEnabled, setRestEndSoundEnabled } = useTheme()
  const [timeLeft, setTimeLeft] = useState(restDuration)
  const [isRunning, setIsRunning] = useState(false)
  const [showRestPicker, setShowRestPicker] = useState(false)
  const { playCountdown } = useAudio()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeLeftRef = useRef(restDuration)
  const restStartTimeRef = useRef<number | null>(null)
  const lastSecondRef = useRef(-1)

  useEffect(() => {
    if (restTrigger <= 0) return
    clearTimer()
    timeLeftRef.current = restDuration
    setTimeLeft(restDuration)
    setIsRunning(false)
  }, [restTrigger, restDuration])

  useEffect(() => {
    if (!isRunning) return

    restStartTimeRef.current = Date.now()
    lastSecondRef.current = -1

    intervalRef.current = setInterval(() => {
      const elapsedMs = Date.now() - restStartTimeRef.current!
      const currentSecond = Math.floor(elapsedMs / 1000)
      const remaining = Math.max(0, restDuration - currentSecond)

      timeLeftRef.current = remaining
      setTimeLeft(remaining)

      if (remaining <= 0) {
        timeLeftRef.current = 0
        setTimeLeft(0)
        clearTimer()
        setIsRunning(false)
        Vibration.vibrate(300)
        setTimeout(() => {
          timeLeftRef.current = restDuration
          setTimeLeft(restDuration)
        }, 1000)
        onRestEnd()
        return
      }

      if (currentSecond !== lastSecondRef.current) {
        lastSecondRef.current = currentSecond

        if (restEndSoundEnabled && remaining === 3) {
          playCountdown()
        }

        if (remaining <= 3) {
          Vibration.vibrate(100)
        }
      }
    }, 200)

    return () => {
      clearTimer()
    }
  }, [isRunning, restDuration, onRestEnd])

  useEffect(() => {
    if (!isRunning) return

    let cancelled = false

    ;(async () => {
      if (AppState.currentState === "active") return

      await Notifications.cancelAllScheduledNotificationsAsync()
      if (cancelled) return

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Descanso completado",
          body: "¡Es hora de continuar!",
          sound: true,
          vibrate: [0, 250, 250, 250],
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: restDuration,
        },
      })
    })()

    return () => {
      cancelled = true
      Notifications.cancelAllScheduledNotificationsAsync()
    }
  }, [isRunning, restDuration])

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

      <View style={styles.restBtnRow}>
        <HapticButton
          style={[styles.restToggleBtn, { backgroundColor: colors.primary }]}
          onPress={toggleRest}
        >
          <Text style={styles.restToggleIcon}>{isRunning ? "■" : "▶"}</Text>
          <Text style={styles.restToggleText}>
            {isRunning ? formatRestTime(timeLeft) : `Iniciar descanso ${formatRestTime(restDuration)}`}
          </Text>
        </HapticButton>
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
            <View style={styles.pickerSoundRow}>
              <Text style={[styles.pickerSoundLabel, { color: colors.text }]}>Sonido de fin</Text>
              <Switch
                value={restEndSoundEnabled}
                onValueChange={setRestEndSoundEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
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
  restBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  restToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: 20,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    minWidth: 240,
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
  gearBtn: {
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: "rgba(128,128,128,0.15)",
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
  pickerSoundRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.2)",
  },
  pickerSoundLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: "500",
  },
})
