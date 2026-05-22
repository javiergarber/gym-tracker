import { useEffect, useState, useRef, useCallback } from "react"
import { View, Text, StyleSheet, Modal, Pressable, Platform, StatusBar, ActivityIndicator } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

import { useTheme } from "@/hooks/use-theme"
import { spacing, typography, radii } from "@/constants/tokens"
import { getDayExercises, getPreviousSessionWeights, createSession, logSet, completeSession } from "@/server/database"
import HapticButton from "@/components/haptic-button"
import ExerciseCarousel from "@/screens/workout-ongoing/exercise-carousel"
import WeightPicker from "@/screens/workout-ongoing/weight-picker"
import TimerDisplay from "@/screens/workout-ongoing/timer-display"
import StopTrainingDialog from "@/screens/workout-ongoing/stop-training-dialog"
import ActionBar from "@/screens/workout-ongoing/action-bar"
import CompletionModal from "@/screens/workout-ongoing/completion-modal"
import ModifyRecordModal from "@/screens/workout-ongoing/modify-record-modal"
import PendingSetsDialog from "@/screens/workout-ongoing/pending-sets-dialog"
import type { RootStackParamList } from "@/app/navigator.types"
import type { ExerciseWithSets } from "@/constants/types"

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutOngoing">

export default function WorkoutOngoingScreen({ route, navigation }: Props) {
  const { colors, defaultWeight, restTimer: restDuration, setRestTimer } = useTheme()
  const [exercises, setExercises] = useState<ExerciseWithSets[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [weight, setWeight] = useState(defaultWeight)
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [stopDialogVisible, setStopDialogVisible] = useState(false)
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [loggedSetsMap, setLoggedSetsMap] = useState<Record<number, number>>({})
  const [loggedSetsData, setLoggedSetsData] = useState<Record<number, { weight: number; rirLabel: string }[]>>({})
  const [restTrigger, setRestTrigger] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)
  const [showModifyRecord, setShowModifyRecord] = useState(false)
  const [showPendingDialog, setShowPendingDialog] = useState(false)
  const [pendingData, setPendingData] = useState({ name: "", count: 0 })
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set())
  const [previousWeights, setPreviousWeights] = useState<Record<number, { weight: number; rirLabel: string }[]>>({})
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)

  useEffect(() => {
    ;(async () => {
      const data = await getDayExercises(route.params.dayId)
      setExercises(data)

      const prevWeights = await getPreviousSessionWeights(route.params.dayId)
      setPreviousWeights(prevWeights)

      const sid = await createSession(route.params.dayId)
      setSessionId(sid)

      if (data.length > 0) {
        setWeight(prevWeights[data[0].id]?.[0]?.weight ?? defaultWeight)
      }

      setReady(true)
    })()
  }, [route.params.dayId, defaultWeight])

  useEffect(() => {
    if (!ready || paused || showCompletion) return

    startTimeRef.current = Date.now() - elapsedRef.current * 1000

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const elapsedSeconds = Math.floor((now - startTimeRef.current!) / 1000)
      elapsedRef.current = elapsedSeconds
      setElapsed(elapsedSeconds)
    }, 100)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [ready, paused, showCompletion])

  const handleExerciseIndexChange = useCallback(
    (index: number) => {
      setCurrentExerciseIndex(index)
      const current = exercises[index]
      if (current) {
        const prev = previousWeights[current.id]
        setWeight(prev?.[0]?.weight ?? defaultWeight)
      }
    },
    [exercises, previousWeights, defaultWeight],
  )

  async function handleLogSet(rirLabel: string) {
    if (!sessionId) return

    const exercise = exercises[currentExerciseIndex]
    const currentCount = loggedSetsMap[exercise.id] ?? 0
    const nextSetIndex = currentCount + 1

    await logSet(sessionId, exercise.id, nextSetIndex, weight, rirLabel)

    setLoggedSetsMap((prev) => ({
      ...prev,
      [exercise.id]: currentCount + 1,
    }))
    setLoggedSetsData((prev) => ({
      ...prev,
      [exercise.id]: [...(prev[exercise.id] ?? []), { weight, rirLabel }],
    }))

    setRestTrigger((prev) => prev + 1)
  }

  function handleFinishExercise() {
    const exercise = exercises[currentExerciseIndex]
    const loggedCount = loggedSetsMap[exercise.id] ?? 0
    const totalSets = exercise.sets.length
    const pending = totalSets - loggedCount

    if (pending > 0) {
      setPendingData({ name: exercise.name, count: pending })
      setShowPendingDialog(true)
    } else {
      completeAndAdvance()
    }
  }

  function completeAndAdvance() {
    const current = exercises[currentExerciseIndex]
    const newCompleted = new Set(completedExercises)
    newCompleted.add(current.id)
    setCompletedExercises(newCompleted)

    const nextUncompletedIdx = exercises.findIndex((ex) => !newCompleted.has(ex.id))
    if (nextUncompletedIdx >= 0) {
      handleExerciseIndexChange(nextUncompletedIdx)
    } else {
      finishWorkout()
    }
  }

  function finishWorkout() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setPaused(true)
    setShowCompletion(true)
  }

  async function handleGoBack() {
    if (sessionId) {
      await completeSession(sessionId)
    }
    navigation.goBack()
  }

  function handleStopTraining() {
    setMenuVisible(false)
    setStopDialogVisible(true)
  }

  function handleCancelTraining() {
    setMenuVisible(false)
    setCancelDialogVisible(true)
  }

  function confirmCancel() {
    setCancelDialogVisible(false)
    navigation.goBack()
  }

  function confirmStop() {
    setStopDialogVisible(false)
    finishWorkout()
  }

  function togglePause() {
    setPaused((prev) => !prev)
    setMenuVisible(false)
  }

  function handleModifyRecord() {
    setMenuVisible(false)
    setShowModifyRecord(true)
  }

  const handleRestEnd = useCallback(() => {
    setRestTrigger(0)
  }, [])

  function handleModifyRecordClose() {
    setShowModifyRecord(false)
  }

  function handlePendingConfirm() {
    setShowPendingDialog(false)
    completeAndAdvance()
  }

  function handlePendingCancel() {
    setShowPendingDialog(false)
  }



  if (!ready) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Comenzando entrenamiento
        </Text>
      </View>
    )
  }

  const currentExercise = exercises[currentExerciseIndex]

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <HapticButton style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <Text style={[styles.menuIcon, { color: colors.text }]}>☰</Text>
        </HapticButton>
      </View>

      {exercises.length > 0 && (
        <ExerciseCarousel
          exercises={exercises}
          currentIndex={currentExerciseIndex}
          onIndexChange={handleExerciseIndexChange}
          loggedSetsData={loggedSetsData}
          completedExercises={completedExercises}
          previousWeights={previousWeights}
        />
      )}

      <TimerDisplay
        elapsed={elapsed}
        paused={paused}
        restDuration={restDuration}
        restTrigger={restTrigger}
        onRestDurationChange={setRestTimer}
        onRestEnd={handleRestEnd}
      />

      {currentExercise && (
        <WeightPicker
          weight={weight}
          onWeightChange={setWeight}
        />
      )}

      <ActionBar
        onLogSet={handleLogSet}
        onFinishExercise={handleFinishExercise}
        disabled={showCompletion}
      />

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={[styles.menuContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <HapticButton style={styles.menuItem} onPress={togglePause}>
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                {paused ? "Reanudar" : "Pausar"}
              </Text>
            </HapticButton>
            <HapticButton style={styles.menuItem} onPress={handleCancelTraining}>
              <Text style={[styles.menuItemText, { color: colors.danger }]}>
                Cancelar entrenamiento
              </Text>
            </HapticButton>
            <HapticButton style={styles.menuItem} onPress={handleStopTraining}>
              <Text style={[styles.menuItemText, { color: colors.primary }]}>
                Finalizar entrenamiento
              </Text>
            </HapticButton>
            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
            <HapticButton style={styles.menuItem} onPress={handleModifyRecord}>
              <Text style={[styles.menuItemText, { color: colors.textMuted }]}>
                Modificar registro
              </Text>
            </HapticButton>
          </View>
        </Pressable>
      </Modal>

      <StopTrainingDialog
        visible={cancelDialogVisible}
        onConfirm={confirmCancel}
        onCancel={() => setCancelDialogVisible(false)}
        title="Cancelar entrenamiento"
        message="¿Estás seguro? El progreso de esta sesión se perderá."
        confirmText="Cancelar sesión"
        destructive
      />

      <StopTrainingDialog
        visible={stopDialogVisible}
        onConfirm={confirmStop}
        onCancel={() => setStopDialogVisible(false)}
      />

      <PendingSetsDialog
        visible={showPendingDialog}
        exerciseName={pendingData.name}
        pendingCount={pendingData.count}
        onConfirm={handlePendingConfirm}
        onCancel={handlePendingCancel}
      />

      <CompletionModal
        visible={showCompletion}
        totalTime={elapsed}
        onGoBack={handleGoBack}
        exerciseCount={exercises.length}
      />

      {sessionId && currentExercise && (
        <ModifyRecordModal
          visible={showModifyRecord}
          sessionId={sessionId}
          exerciseId={currentExercise.id}
          exerciseName={currentExercise.name}
          onClose={handleModifyRecordClose}
          onModified={() => {}}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.lg,
  },
  loadingText: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    letterSpacing: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight ?? 24) + spacing.md,
    paddingBottom: 0,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 20,
  },
  menuOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: Platform.OS === "ios" ? 110 : (StatusBar.currentHeight ?? 24) + spacing.xxl + spacing.md,
    paddingRight: spacing.lg,
  },
  menuContent: {
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingVertical: spacing.sm,
    minWidth: 220,
  },
  menuItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuItemText: {
    fontSize: typography.body.fontSize,
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    marginHorizontal: spacing.lg,
  },
})
