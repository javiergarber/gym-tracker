import { View, Text, ScrollView, StyleSheet } from "react-native"

import { useTheme } from "@/hooks/use-theme"
import { themes, type ThemeName } from "@/constants/theme"
import { spacing, typography, radii } from "@/constants/tokens"
import HapticButton from "@/components/haptic-button"

const REST_OPTIONS = [60, 90, 120]

function ThemePreviewCard({ name, selected, onSelect }: { name: ThemeName; selected: boolean; onSelect: () => void }) {
  const t = themes[name]
  const label = name === "negroNeon" ? "Némesis" : "Aurora"
  const swatchColors = [t.colors.background, t.colors.primary]
  const swatchBorder = t.dark ? "#fff" : "#000"

  return (
    <HapticButton
      style={[
        localStyles.previewCard,
        { backgroundColor: t.colors.surface, borderColor: selected ? t.colors.primary : t.colors.border },
        selected && localStyles.previewCardSelected,
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={localStyles.swatchRow}>
        {swatchColors.map((color, i) => (
          <View key={i} style={[localStyles.swatch, { backgroundColor: color, borderColor: swatchBorder }]} />
        ))}
      </View>
      <Text style={[localStyles.previewLabel, { color: t.colors.text }]}>{label}</Text>
      <Text style={[localStyles.previewSub, { color: t.colors.textMuted }]}>
        {t.dark ? "Oscuro" : "Claro"}
      </Text>
      </HapticButton>
  )
}

export default function SettingsScreen() {
  const { themeName, setThemeName, restTimer, setRestTimer } = useTheme()
  const { colors } = useTheme().theme

  return (
    <ScrollView style={[localStyles.screen, { backgroundColor: colors.background }]} contentContainerStyle={localStyles.content}>
      <View style={[localStyles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[localStyles.sectionTitle, { color: colors.text }]}>Tema</Text>
        <Text style={[localStyles.sectionSub, { color: colors.textTertiary }]}>
          Elige el estilo visual de la aplicación
        </Text>
        <View style={localStyles.themeRow}>
          <ThemePreviewCard name="negroNeon" selected={themeName === "negroNeon"} onSelect={() => setThemeName("negroNeon")} />
          <ThemePreviewCard name="azul" selected={themeName === "azul"} onSelect={() => setThemeName("azul")} />
        </View>
      </View>

      <View style={[localStyles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[localStyles.sectionTitle, { color: colors.text }]}>Tiempo de descanso</Text>
        <Text style={[localStyles.sectionSub, { color: colors.textTertiary }]}>
          Tiempo predeterminado entre ejercicios
        </Text>
        <View style={localStyles.restRow}>
          {REST_OPTIONS.map((sec) => (
            <HapticButton
              key={sec}
              style={[
                localStyles.restOption,
                {
                  backgroundColor: restTimer === sec ? colors.primary : "transparent",
                  borderColor: restTimer === sec ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setRestTimer(sec)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  localStyles.restText,
                  { color: restTimer === sec ? "#fff" : colors.text },
                ]}
              >
                {sec / 60 > 1 ? `${sec / 60} min` : `${sec} s`}
              </Text>
            </HapticButton>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const localStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: 40,
  },
  section: {
    borderRadius: radii.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    marginBottom: spacing.xs,
  },
  sectionSub: {
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.lg,
  },
  themeRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  previewCard: {
    flex: 1,
    borderRadius: radii.md,
    borderWidth: 2,
    padding: spacing.lg,
    alignItems: "center",
  },
  previewCardSelected: {
    borderWidth: 2,
  },
  swatchRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: spacing.md,
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  previewLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
  previewSub: {
    fontSize: typography.captionSmall.fontSize,
    marginTop: 2,
  },
  restRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  restOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    alignItems: "center",
  },
  restText: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
})
