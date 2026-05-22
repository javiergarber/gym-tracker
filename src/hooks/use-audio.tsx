import { createContext, useContext, useEffect, type ReactNode } from "react"
import { Platform } from "react-native"
import { createAudioPlayer, setAudioModeAsync } from "expo-audio"
import * as Notifications from "expo-notifications"

const player = createAudioPlayer(require("@/assets/audio/beep-countdown.wav"))

function playCountdown() {
  try {
    player.seekTo(0)
    player.play()
  } catch {
    // Ignorar error en recarga
  }
}

interface AudioContextValue {
  playCountdown: () => void
}

const AudioContext = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
    })

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: false,
        shouldShowList: false,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    })

    Notifications.requestPermissionsAsync()

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("rest-timer", {
        name: "Descanso",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
      })
    }
  }, [])

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
