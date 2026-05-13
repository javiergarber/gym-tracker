# Feature: Detalle del entrenamiento (Workout Detail)

## Summary
Pantalla que muestra el nombre del entrenamiento y la lista de días que lo componen, permitiendo navegar al detalle de cada día.

## Phases

### Phase 1: DB + navegación ✅
- [x] Añadir `getWorkoutDays(workoutId)` a `database.ts` que devuelva los días ordenados por `sort_order`
- [x] Añadir ruta `DayDetail: { dayId: number }` en `navigation/types.ts`
- [x] Crear `DayDetailScreen.tsx` placeholder
- [x] Registrar `DayDetail` en el Navigator

### Phase 2: UI de WorkoutDetailScreen ✅
- [x] Reemplazar placeholder: obtener `workoutDays` desde DB
- [x] Mostrar nombre del workout como título dinámico
- [x] Mostrar lista de días (nombre + subtítulo opcional) con `FlatList`
- [x] Cada día navega a `DayDetail` con `dayId`
- [x] Aplicar tokens de diseño (spacing, typography, radii, colores)

---

✅ **Finalizado**
