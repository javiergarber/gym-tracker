# Feature: Sistema de temas + Pantalla de Ajustes

## Summary
Implementar dos temas intercambiables (Negro Neón dark / Azul light) con persistencia, y la pantalla de Ajustes con selector visual de tema y configuración del tiempo de descanso.

✅ **Finalizado**

## Phases

### Phase 1: Sistema de temas
- [x] Instalar `@react-native-async-storage/async-storage` con `npx expo install`
- [x] Definir dos paletas completas en `src/theme.ts`: `negroNeonTheme` (dark: fondo #0A0A0F, morado #7C3AED, verde neón #4ADE80) y `azulTheme` (light: fondo #F8FAFC, azul #0A84FF, teal #14B8A6)
- [x] Mantener `spacing`, `typography` y `radii` como valores fijos compartidos en `src/tokens.ts`
- [x] Crear `src/context/ThemeContext.tsx` con `ThemeProvider`, `useTheme()`, tipo `ThemeName = "negroNeon" | "azul"`
- [x] Persistir la selección en AsyncStorage bajo key `"theme"`
- [x] Envolver `App.tsx` con `ThemeProvider` (por fuera de `DatabaseProvider`)
- [x] Actualizar `StatusBar` style según el tema activo (light/dark)

### Phase 2: Pantalla de Ajustes
- [x] Construir `src/screens/SettingsScreen.tsx` completa:
  - Sección "Tema" con dos tarjetas de preview visual mostrando los colores representativos de cada tema
  - Al seleccionar un tema, aplicar inmediatamente y persistir
  - Sección "Tiempo de descanso" con selector de opciones: 60s, 90s, 120s
  - Guardar selección de descanso en AsyncStorage bajo key `"restTimer"`
- [x] Verificar navegación desde Home (icono engranaje) y botón de volver atrás

### Phase 3: Migrar componentes al tema dinámico
- [x] Actualizar `Home.tsx` para usar `useTheme()` con estilos dinámicos
- [x] Actualizar `WorkoutDetailScreen.tsx` para usar `useTheme()`
- [x] Actualizar `WorkoutCard.tsx` para usar `useTheme()`
- [x] Actualizar `DeleteWorkoutConfirmDialog.tsx` para usar `useTheme()`
- [x] Actualizar `RenameWorkoutModal.tsx` para usar `useTheme()`
- [x] Actualizar `NewWorkoutDialog.tsx` para usar `useTheme()`
- [x] Actualizar `DatabaseContext.tsx` para usar `useTheme()` en su loading screen

---

## Next step
Implementación completada. TypeScript compila sin errores.
