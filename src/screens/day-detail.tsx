import { useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, View, Platform, Modal, Pressable } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

import { useTheme } from "@/hooks/use-theme"
import { useActiveWorkout } from "@/hooks/use-active-workout"
import { spacing, typography, radii } from "@/constants/tokens"
import { getDayById, getDayExercises, deleteSession } from "@/server/database"
import HapticButton from "@/components/haptic-button"
import MiniWorkoutBar from "@/components/mini-workout-bar"
import type { RootStackParamList } from "@/app/navigator.types"
import type { Day, ExerciseWithSets } from "@/constants/types"

function formatSets(exercise: ExerciseWithSets): string {
  const allReps = exercise.sets.map((s) => s.reps?.trim()).filter(Boolean)
  if (allReps.length === 0) return `${exercise.sets.length} series`

  const uniqueReps = [...new Set(allReps)]

  return uniqueReps.length === 1
    ? `${exercise.sets.length}x${uniqueReps[0]}`
    : `${exercise.sets.length}x${allReps.join(",")}`
}

type Props = NativeStackScreenProps<RootStackParamList, "DayDetail">

export default function DayDetailScreen({ route, navigation }: Props) {
  const { colors } = useTheme()
  const activeWorkout = useActiveWorkout()
  const [day, setDay] = useState<Day | null>(null)
  const [exercises, setExercises] = useState<ExerciseWithSets[]>([])
  const [showActiveWarning, setShowActiveWarning] = useState(false)

  useEffect(() => {
    ;(async () => {
      const dayData = await getDayById(route.params.dayId)
      if (dayData) {
        setDay(dayData)
        navigation.setOptions({ title: dayData.name })
      }
      const exercisesData = await getDayExercises(route.params.dayId)
      setExercises(exercisesData)
    })()
  }, [route.params.dayId])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MiniWorkoutBar />
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          day?.subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {day.subtitle}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.exerciseCard, { backgroundColor: colors.surface }]}>
            <View style={styles.exerciseBody}>
              <Text style={[styles.exerciseName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text style={[styles.exerciseMeta, { color: colors.textTertiary }]}>
                {formatSets(item)}
              </Text>
            </View>
            <HapticButton
              style={[styles.historyButton, { borderColor: colors.border }]}
              onPress={() =>
                navigation.navigate("ExerciseHistory", {
                  exerciseId: item.id,
                  exerciseName: item.name,
                })
              }
            >
              <Text style={[styles.historyButtonText, { color: colors.primary }]}>
                Historial
              </Text>
            </HapticButton>
          </View>
        )}
      />

      <View
        style={[
          styles.bottomSection,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={styles.startButtonWrapper}>
          <HapticButton
            style={[styles.startButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              if (activeWorkout.isActive) {
                setShowActiveWarning(true)
              } else {
                navigation.navigate("WorkoutOngoing", { dayId: route.params.dayId })
              }
            }}
          >
            <Text style={styles.startButtonText}>Comenzar</Text>
          </HapticButton>
        </View>
      </View>

      <Modal
        visible={showActiveWarning}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActiveWarning(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowActiveWarning(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Entrenamiento en curso
            </Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              Ya hay un entrenamiento activo. Si empiezas uno nuevo, el anterior se perderá sin guardarse.
            </Text>
            <View style={styles.modalActions}>
              <HapticButton
                style={[styles.modalButton, { backgroundColor: colors.backgroundSecondary }]}
                onPress={() => setShowActiveWarning(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Seguir actual</Text>
              </HapticButton>
              <HapticButton
                style={[styles.modalButton, { backgroundColor: colors.danger }]}
                onPress={async () => {
                  if (activeWorkout.sessionData) {
                    await deleteSession(activeWorkout.sessionData.sessionId)
                  }
                  activeWorkout.discardWorkout()
                  setShowActiveWarning(false)
                  navigation.navigate("WorkoutOngoing", { dayId: route.params.dayId })
                }}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Empezar nuevo</Text>
              </HapticButton>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    marginBottom: spacing.lg,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
      },
    }),
  },
  exerciseBody: { flex: 1 },
  exerciseName: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
  },
  exerciseMeta: {
    fontSize: typography.caption.fontSize,
    marginTop: spacing.xs,
  },
  historyButton: {
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  historyButtonText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "600",
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  startButtonWrapper: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  startButton: {
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: typography.h3.fontSize,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: spacing.lg,
  },
  modalContent: {
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  modalMessage: {
    fontSize: typography.body.fontSize,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: "600",
  },
})
