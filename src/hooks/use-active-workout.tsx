import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react"

export interface ActiveWorkoutData {
  sessionId: number
  dayId: number
  dayName: string
  workoutName: string
}

interface ActiveWorkoutContextValue {
  sessionData: ActiveWorkoutData | null
  elapsed: number
  isActive: boolean
  isMinimized: boolean
  isPaused: boolean

  startWorkout: (data: ActiveWorkoutData) => void
  minimizeWorkout: () => void
  restoreWorkout: () => void
  discardWorkout: () => void
  togglePause: () => void
  syncTimestamp: (startTimestamp: number, isPaused: boolean) => void
}

const ActiveWorkoutContext = createContext<ActiveWorkoutContextValue | null>(null)

export function ActiveWorkoutProvider({ children }: { children: ReactNode }) {
  const [sessionData, setSessionData] = useState<ActiveWorkoutData | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const startTimestampRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    if (intervalRef.current) return
    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const seconds = Math.floor((now - startTimestampRef.current) / 1000)
      setElapsed(seconds)
    }, 100)
  }, [])

  const startWorkout = useCallback((data: ActiveWorkoutData) => {
    setSessionData(data)
    startTimestampRef.current = Date.now()
    setElapsed(0)
    setIsPaused(false)
    setIsMinimized(false)
    startTimer()
  }, [startTimer])

  const minimizeWorkout = useCallback(() => {
    setIsMinimized(true)
  }, [])

  const restoreWorkout = useCallback(() => {
    setIsMinimized(false)
  }, [])

  const discardWorkout = useCallback(() => {
    stopTimer()
    setSessionData(null)
    setElapsed(0)
    setIsMinimized(false)
    setIsPaused(false)
  }, [stopTimer])

  const togglePause = useCallback(() => {
    if (isPaused) {
      stopTimer()
      startTimestampRef.current = Date.now() - elapsed * 1000
      setIsPaused(false)
      startTimer()
    } else {
      stopTimer()
      setIsPaused(true)
    }
  }, [isPaused, elapsed, stopTimer, startTimer])

  const syncTimestamp = useCallback((startTimestamp: number, paused: boolean) => {
    stopTimer()
    startTimestampRef.current = startTimestamp
    setIsPaused(paused)
    if (!paused) {
      startTimer()
    }
  }, [stopTimer, startTimer])

  useEffect(() => {
    return () => stopTimer()
  }, [stopTimer])

  return (
    <ActiveWorkoutContext.Provider
      value={{
        sessionData,
        elapsed,
        isActive: sessionData !== null,
        isMinimized,
        isPaused,
        startWorkout,
        minimizeWorkout,
        restoreWorkout,
        discardWorkout,
        togglePause,
        syncTimestamp,
      }}
    >
      {children}
    </ActiveWorkoutContext.Provider>
  )
}

export function useActiveWorkout() {
  const ctx = useContext(ActiveWorkoutContext)
  if (!ctx) throw new Error("useActiveWorkout must be used within ActiveWorkoutProvider")
  return ctx
}
