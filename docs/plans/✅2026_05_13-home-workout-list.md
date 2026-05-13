# Feature: Home — Lista de entrenamientos

## Summary
Pantalla principal que muestra todos los entrenamientos en formato de lista, permite navegar al detalle de cada uno, acceder a Ajustes y crear nuevos entrenamientos desde CSV.

## Phases

### Phase 1: Navegación ✅
- [x] Instalar `@react-navigation/native`, `@react-navigation/native-stack`, `react-native-screens`, `react-native-safe-area-context`
- [x] Crear `src/navigation/types.ts` con `RootStackParamList`
- [x] Crear `src/navigation/Navigator.tsx` con stack: Home, WorkoutDetail, Settings
- [x] Refactorizar `App.tsx` para usar `NavigationContainer` y mover lógica DB a un hook
- [x] Crear screens placeholder `WorkoutDetailScreen.tsx` y `SettingsScreen.tsx`

### Phase 2: Home screen mejorada ✅
- [x] Extraer tarjeta de workout a `components/WorkoutCard.tsx` con `onPress`
- [x] Añadir icono de Ajustes (engranaje) en el header de Home
- [x] Navegar a WorkoutDetail al pulsar una tarjeta, pasando `workoutId` como parámetro
- [x] Mejorar diseño de tarjetas (colores, sombras, formato de fecha)

### Phase 3: Estado vacío y pulido ✅
- [x] Actualizar empty state: texto "No hay entrenamientos todavía, ¡crea uno!" + botón "Nuevo entrenamiento"
- [x] Reemplazar botón debug por icono de Ajustes funcional
- [x] Crear archivo `src/theme.ts` con tokens de diseño (colores, spacing, tipografía)
- [x] Aplicar tokens a Home y componentes existentes
- [x] Asegurar responsive en web y móvil

---

✅ **Finalizado**
