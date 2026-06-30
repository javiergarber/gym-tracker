import { useEffect, useState, useRef, useCallback } from "react"
import { View, Text, StyleSheet, Modal, Pressable, Platform, StatusBar, ActivityIndicator } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

import { useTheme } from "@/hooks/use-theme"
import { useActiveWorkout } from "@/hooks/use-active-workout"
import { spacing, typography, radii } from "@/constants/tokens"
import {
  getDayExercises,
  getPreviousSessionWeights,
  getDayWithWorkout,
  getSessionSetsBySession,
  createSession,
  logSet,
  completeSession,
} from "@/server/database"
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
import type { ExerciseWithSets, SessionSet } from "@/constants/types"

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutOngoing">

function rebuildFromSessionSets(
  sessionSets: SessionSet[],
  exercises: ExerciseWithSets[],
) {
  const map: Record<number, number> = {}
  const data: Record<number, { weight: number; rirLabel: string }[]> = {}
  const completed = new Set<number>()

  for (const set of sessionSets) {
    const eid = set.exercise_id
    map[eid] = (map[eid] ?? 0) + 1
    if (!data[eid]) data[eid] = []
    data[eid].push({ weight: set.weight, rirLabel: set.rir_label })
  }

  for (const ex of exercises) {
    const count = map[ex.id] ?? 0
    if (count >= ex.sets.length) {
      completed.add(ex.id)
    }
  }

  const firstUncompletedIdx = exercises.findIndex((ex) => !completed.has(ex.id))

  return { loggedSetsMap: map, loggedSetsData: data, completedExercises: completed, firstUncompletedIdx }
}

export default function WorkoutOngoingScreen({ route, navigation }: Props) {
  const { colors, defaultWeight, restTimer: restDuration, setRestTimer } = useTheme()
  const activeWorkout = useActiveWorkout()
  const [exercises, setExercises] = useState<ExerciseWithSets[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [weight, setWeight] = useState(defaultWeight)
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
  const [selectedWeights, setSelectedWeights] = useState<Record<number, number>>({})
  const [isRestoring, setIsRestoring] = useState(false)
  const intentionalExitRef = useRef(false)

  useEffect(() => {
    ;(async () => {
      const data = await getDayExercises(route.params.dayId)
      setExercises(data)

      const dayWithWorkout = await getDayWithWorkout(route.params.dayId)
      const dName = dayWithWorkout?.day_name ?? ""
      const wName = dayWithWorkout?.workout_name ?? ""

      const prevWeights = await getPreviousSessionWeights(route.params.dayId)
      setPreviousWeights(prevWeights)

      const existingSession = activeWorkout.sessionData
      if (existingSession && existingSession.dayId === route.params.dayId) {
        setIsRestoring(true)
        setSessionId(existingSession.sessionId)

        const sessionSets = await getSessionSetsBySession(existingSession.sessionId)
        const rebuilt = rebuildFromSessionSets(sessionSets, data)

        setLoggedSetsMap(rebuilt.loggedSetsMap)
        setLoggedSetsData(rebuilt.loggedSetsData)
        setCompletedExercises(rebuilt.completedExercises)

        const startIdx = rebuilt.firstUncompletedIdx >= 0 ? rebuilt.firstUncompletedIdx : 0
        setCurrentExerciseIndex(startIdx)
        if (data.length > 0) {
          const restoredSets = rebuilt.loggedSetsData[data[startIdx].id]
          const initialWeight =
            restoredSets?.length
              ? restoredSets[restoredSets.length - 1].weight
              : prevWeights[data[startIdx].id]?.[0]?.weight ?? defaultWeight
          setWeight(initialWeight)
          setSelectedWeights((prev) => ({ ...prev, [data[startIdx].id]: initialWeight }))
        }

        activeWorkout.restoreWorkout()
      } else {
        if (existingSession) {
          activeWorkout.discardWorkout()
        }

        const sid = await createSession(route.params.dayId)
        setSessionId(sid)

        if (data.length > 0) {
          const initialWeight = prevWeights[data[0].id]?.[0]?.weight ?? defaultWeight
          setWeight(initialWeight)
          setSelectedWeights((prev) => ({ ...prev, [data[0].id]: initialWeight }))
        }

        activeWorkout.startWorkout({
          sessionId: sid,
          dayId: route.params.dayId,
          dayName: dName,
          workoutName: wName,
        })
      }

      setReady(true)
    })()
  }, [route.params.dayId, defaultWeight])

  function getWeightForExercise(exerciseId: number): number {
    const selected = selectedWeights[exerciseId]
    if (selected !== undefined) return selected
    const currentSets = loggedSetsData[exerciseId]
    if (currentSets?.length) {
      return currentSets[currentSets.length - 1].weight
    }
    const prev = previousWeights[exerciseId]
    if (prev?.length) {
      return prev[0].weight
    }
    return defaultWeight
  }

  const handleExerciseIndexChange = useCallback(
    (index: number) => {
      setCurrentExerciseIndex(index)
      const current = exercises[index]
      if (current) {
        setWeight(getWeightForExercise(current.id))
      }
    },
    [exercises, previousWeights, defaultWeight, loggedSetsData, selectedWeights],
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
    setSelectedWeights((prev) => ({ ...prev, [exercise.id]: weight }))

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
    if (!activeWorkout.isPaused) {
      activeWorkout.togglePause()
    }
    setShowCompletion(true)
  }

  async function handleGoBack() {
    intentionalExitRef.current = true
    if (sessionId) {
      await completeSession(sessionId)
    }
    activeWorkout.discardWorkout()
    navigation.goBack()
  }

  function handleMinimize() {
    intentionalExitRef.current = true
    activeWorkout.minimizeWorkout()
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
    intentionalExitRef.current = true
    setCancelDialogVisible(false)
    activeWorkout.discardWorkout()
    navigation.goBack()
  }

  function confirmStop() {
    setStopDialogVisible(false)
    finishWorkout()
  }

  function handleModifyRecord() {
    setMenuVisible(false)
    setShowModifyRecord(true)
  }

  const handleRestEnd = useCallback(() => {
    setRestTrigger(0)
  }, [])

  async function handleModified() {
    if (!sessionId) return
    const sessionSets = await getSessionSetsBySession(sessionId)
    const rebuilt = rebuildFromSessionSets(sessionSets, exercises)
    setLoggedSetsMap(rebuilt.loggedSetsMap)
    setLoggedSetsData(rebuilt.loggedSetsData)
    setCompletedExercises(rebuilt.completedExercises)
  }

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

  const { minimizeWorkout: ctxMinimize } = useActiveWorkout()

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (intentionalExitRef.current) return
      if (!sessionId || !ready) return

      e.preventDefault()

      ctxMinimize()
      intentionalExitRef.current = true
      navigation.goBack()
    })

    return unsubscribe
  }, [navigation, sessionId, ready, ctxMinimize])

  if (!ready) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {isRestoring ? "Reanudando entrenamiento" : "Comenzando entrenamiento"}
        </Text>
      </View>
    )
  }

  const currentExercise = exercises[currentExerciseIndex]

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight ?? 24) + spacing.md }]}>
        <HapticButton style={styles.backButton} onPress={handleMinimize}>
          <View style={[styles.backArrow, { borderColor: colors.text }]} />
        </HapticButton>
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
        elapsed={activeWorkout.elapsed}
        paused={activeWorkout.isPaused}
        restDuration={restDuration}
        restTrigger={restTrigger}
        onRestDurationChange={setRestTimer}
        onRestEnd={handleRestEnd}
      />

      {currentExercise && (
        <WeightPicker
          weight={weight}
          onWeightChange={(w) => {
            setWeight(w)
            setSelectedWeights((prev) => ({ ...prev, [currentExercise.id]: w }))
          }}
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
            <HapticButton style={styles.menuItem} onPress={activeWorkout.togglePause}>
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                {activeWorkout.isPaused ? "Reanudar" : "Pausar"}
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
        totalTime={activeWorkout.elapsed}
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
          onModified={handleModified}
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
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: 0,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    width: 14,
    height: 14,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    transform: [{ rotate: "45deg" }],
    marginLeft: 5,
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
