import { TouchableOpacity, Platform, type TouchableOpacityProps } from "react-native"
import * as Haptics from "expo-haptics"

type Props = TouchableOpacityProps & {
  hapticStyle?: Haptics.ImpactFeedbackStyle
}

export default function HapticButton({ onPress, hapticStyle = Haptics.ImpactFeedbackStyle.Light, ...props }: Props) {
  return (
    <TouchableOpacity
      onPress={(e) => {
        if (Platform.OS !== "web") Haptics.impactAsync(hapticStyle)
        onPress?.(e)
      }}
      {...props}
    />
  )
}
