import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, Alert, Switch } from "react-native"

import { useTheme } from "@/hooks/use-theme"
import { useAudio } from "@/hooks/use-audio"
import { themes, type ThemeName } from "@/constants/theme"
import { spacing, typography, radii } from "@/constants/tokens"
import { DEFAULTS, VALID_REST_TIMERS, DEFAULT_WEIGHT_OPTIONS, DECIMAL_STEP_OPTIONS } from "@/constants/defaults"
import HapticButton from "@/components/haptic-button"
import { useDatabase } from "@/hooks/use-database"
import { clearAllData } from "@/server/database"
import { seedDatabase } from "@/server/database/seed"

const REST_OPTIONS = VALID_REST_TIMERS

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
  const [loadingDev, setLoadingDev] = useState(false)
  const { themeName, setThemeName, restTimer, setRestTimer, defaultWeight, setDefaultWeight, decimalStep, setDecimalStep, extraMotivationSoundsEnabled, setExtraMotivationSoundsEnabled, restEndSoundEnabled, setRestEndSoundEnabled, resetToDefaults } = useTheme()
  const { colors } = useTheme().theme
  const { onRefresh } = useDatabase()
  const { playYey } = useAudio()

  const handleClear = async () => {
    setLoadingDev(true)
    try {
      await clearAllData()
      await onRefresh()
      Alert.alert("Hecho", "Base de datos limpiada")
    } catch {
      Alert.alert("Error", "No se pudo limpiar la base de datos")
    } finally {
      setLoadingDev(false)
    }
  }

  const handleSeed = async () => {
    setLoadingDev(true)
    try {
      await seedDatabase()
      await onRefresh()
      Alert.alert("Hecho", "Datos de ejemplo insertados")
    } catch {
      Alert.alert("Error", "No se pudieron insertar los datos de ejemplo")
    } finally {
      setLoadingDev(false)
    }
  }

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
        <View style={[localStyles.inlineRow, { marginTop: spacing.lg }]}>
          <Text style={[localStyles.inlineLabel, { color: colors.text }]}>Sonido de fin de descanso</Text>
          <Switch
            value={restEndSoundEnabled}
            onValueChange={setRestEndSoundEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={[localStyles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[localStyles.sectionTitle, { color: colors.text }]}>Peso por defecto</Text>
        <Text style={[localStyles.sectionSub, { color: colors.textTertiary }]}>
          Valor inicial del selector cuando no hay registro previo
        </Text>
        <View style={localStyles.weightRow}>
          {DEFAULT_WEIGHT_OPTIONS.map((w) => (
            <HapticButton
              key={w}
              style={[
                localStyles.weightOption,
                {
                  backgroundColor: defaultWeight === w ? colors.primary : "transparent",
                  borderColor: defaultWeight === w ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setDefaultWeight(w)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  localStyles.weightText,
                  { color: defaultWeight === w ? "#fff" : colors.text },
                ]}
              >
                {w} kg
              </Text>
            </HapticButton>
          ))}
        </View>
      </View>

      <View style={[localStyles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[localStyles.sectionTitle, { color: colors.text }]}>Sonido</Text>
        <View style={localStyles.inlineRow}>
          <Text style={[localStyles.inlineLabel, { color: colors.text }]}>Sonidos de motivación extra</Text>
          <Switch
            value={extraMotivationSoundsEnabled}
            onValueChange={(val) => {
              setExtraMotivationSoundsEnabled(val)
              if (val) playYey()
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={[localStyles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[localStyles.sectionTitle, { color: colors.text }]}>Step de decimales</Text>
        <Text style={[localStyles.sectionSub, { color: colors.textTertiary }]}>
          Precisión del selector de peso
        </Text>
        <View style={localStyles.restRow}>
          {DECIMAL_STEP_OPTIONS.map((step) => (
            <HapticButton
              key={step}
              style={[
                localStyles.restOption,
                {
                  backgroundColor: decimalStep === step ? colors.primary : "transparent",
                  borderColor: decimalStep === step ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setDecimalStep(step)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  localStyles.restText,
                  { color: decimalStep === step ? "#fff" : colors.text },
                ]}
              >
                {step.toFixed(2)}
              </Text>
            </HapticButton>
          ))}
        </View>
      </View>

      {__DEV__ && (
        <View style={[localStyles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[localStyles.sectionTitle, { color: colors.text }]}>Desarrollo</Text>
          <Text style={[localStyles.sectionSub, { color: colors.textTertiary }]}>
            Herramientas de depuración
          </Text>
          <View style={localStyles.devRow}>
            <HapticButton
              style={[localStyles.devBtn, { backgroundColor: colors.danger }]}
              onPress={handleClear}
              disabled={loadingDev}
            >
              <Text style={localStyles.devBtnText}>Limpiar BD</Text>
            </HapticButton>
            <HapticButton
              style={[localStyles.devBtn, { backgroundColor: colors.primary }]}
              onPress={handleSeed}
              disabled={loadingDev}
            >
              <Text style={localStyles.devBtnText}>Poblar con ejemplo</Text>
            </HapticButton>
          </View>
          <View style={[localStyles.devRow, { marginTop: spacing.sm }]}>
            <HapticButton
              style={[localStyles.devBtn, { backgroundColor: colors.textTertiary }]}
              onPress={resetToDefaults}
            >
              <Text style={localStyles.devBtnText}>Resetear ajustes</Text>
            </HapticButton>
          </View>
        </View>
      )}
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
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inlineLabel: {
    fontSize: typography.body.fontSize,
    fontWeight: "500",
    flexShrink: 1,
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
  weightRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  weightOption: {
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    alignItems: "center",
  },
  weightText: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
  },
  devRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  devBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radii.sm,
    alignItems: "center",
  },
  devBtnText: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    color: "#fff",
  },
})
