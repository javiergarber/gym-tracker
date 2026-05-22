import { createContext, useContext, useEffect, type ReactNode } from "react"
import { Platform } from "react-native"
import { createAudioPlayer, setAudioModeAsync } from "expo-audio"
import * as Notifications from "expo-notifications"

const countdownPlayer = createAudioPlayer(require("@/assets/audio/beep-countdown.wav"))
const nicePlayer = createAudioPlayer(require("@/assets/audio/click-nice.mp3"))
const justDoItPlayer = createAudioPlayer(require("@/assets/audio/just-do-it.mp3"))
const anotherOnePlayer = createAudioPlayer(require("@/assets/audio/another-one.mp3"))
const ezPlayer = createAudioPlayer(require("@/assets/audio/ez.mp3"))
const yeyPlayer = createAudioPlayer(require("@/assets/audio/yey.mp3"))

function playCountdown() {
  try {
    countdownPlayer.seekTo(0)
    countdownPlayer.play()
  } catch {
    // Ignorar error en recarga
  }
}

function playNice() {
  try {
    nicePlayer.seekTo(0)
    nicePlayer.play()
  } catch {
    // Ignorar error en recarga
  }
}

function playJustDoIt() {
  try {
    justDoItPlayer.seekTo(0)
    justDoItPlayer.play()
  } catch {
    // Ignorar error en recarga
  }
}

function playAnotherOne() {
  try {
    anotherOnePlayer.seekTo(0)
    anotherOnePlayer.play()
  } catch {
    // Ignorar error en recarga
  }
}

function playEz() {
  try {
    ezPlayer.seekTo(0)
    ezPlayer.play()
  } catch {
    // Ignorar error en recarga
  }
}

function playYey() {
  try {
    yeyPlayer.seekTo(0)
    yeyPlayer.play()
  } catch {
    // Ignorar error en recarga
  }
}

interface AudioContextValue {
  playCountdown: () => void
  playNice: () => void
  playJustDoIt: () => void
  playAnotherOne: () => void
  playEz: () => void
  playYey: () => void
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
    <AudioContext.Provider value={{ playCountdown, playNice, playJustDoIt, playAnotherOne, playEz, playYey }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error("useAudio must be used within AudioProvider")
  return ctx
}
