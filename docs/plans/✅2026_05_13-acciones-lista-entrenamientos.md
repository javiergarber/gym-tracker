# Feature: Acciones en lista de entrenamientos (swipe/long-press)
✅ **Finalizado**

## Summary
Añadir gesto de deslizar a la izquierda o mantener pulsado sobre las tarjetas de entrenamiento en la Home para revelar botones de **Renombrar** y **Eliminar**, con modal y confirmación respectivamente.

## Phases

### Phase 1: Swipe/long-press + botones de acción (✅ Completada)
- [x] Instalar `react-native-gesture-handler`
- [x] Envolver `WorkoutCard` con `Swipeable` de gesture-handler
- [x] Renderizar dos botones (Renombrar / Eliminar) como `renderRightActions`
- [x] Añadir `onLongPress` como alternativa en el `TouchableOpacity`
- [x] Botones con iconos y colores (azul renombrar, rojo eliminar)

### Phase 2: Modal renombrar + confirmación eliminar + persistencia (✅ Completada)
- [x] Crear componente `RenameWorkoutModal` con input pre-relleno
- [x] Crear componente `DeleteWorkoutConfirmDialog` (modal o `Alert`)
- [x] Añadir métodos `renameWorkout(id, name)` y `deleteWorkout(id)` en `DatabaseContext`
- [x] Integrar modales en `Home.tsx` conectando al swipe/long-press
- [x] Refresh automático de la lista tras renombrar/eliminar
