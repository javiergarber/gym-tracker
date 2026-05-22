import { createContext, useContext, useRef, useEffect, type ReactNode } from "react"
import { Audio } from "expo-av"

interface AudioContextValue {
  playCountdown: () => void
}

const AudioContext = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null)

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    })

    let cancelled = false

    ;(async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("@/assets/audio/beep-countdown.wav"),
          { shouldPlay: false },
        )
        if (cancelled) {
          sound.unloadAsync()
          return
        }
        soundRef.current = sound

        await sound.setVolumeAsync(0)
        await sound.playAsync()
        await sound.stopAsync()
        await sound.setVolumeAsync(1)
      } catch {}
    })()

    return () => {
      cancelled = true
      soundRef.current?.unloadAsync()
    }
  }, [])

  function playCountdown() {
    soundRef.current?.replayAsync()
  }

  return (
    <AudioContext.Provider value={{ playCountdown }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error("useAudio must be used within AudioProvider")
  return ctx
}
