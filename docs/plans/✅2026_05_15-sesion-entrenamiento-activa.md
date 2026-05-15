# Feature: Sesión de entrenamiento activa

## Summary
Pantalla principal durante la realización del entrenamiento con cronómetro, carrusel de ejercicios, selector de peso, botones de acción, temporizador de descanso y flujo de finalización.

## Phases

### Phase 1: Esqueleto de pantalla + Cronómetro + Menú + Navegación ✅
- [x] Reemplazar placeholder `src/screens/workout-ongoing.tsx` con layout completo: fondo oscuro, barra superior (menú hamburguesa en botón circular semitransparente), cabecera "TIEMPO TOTAL", cronómetro gigante
- [x] Consultar ejercicios del día desde DB (`getDayExercises`) al montar la pantalla
- [x] Implementar cronómetro con `useEffect` + `setInterval`: arranca solo al entrar, formato `HH:MM:SS`, color morado primario
- [x] Botón de opciones (hamburguesa) con menú contextual: "Pausar", "Reanudar", "Parar entrenamiento", "Modificar registro" (placeholder)
- [x] "Parar entrenamiento": confirmación con `Alert.alert` → `navigation.goBack()`
- [x] Pausar/Reanudar: detener/reanudar intervalo del cronómetro
- [x] Navegación: al pulsar "Comenzar" desde DayDetail se pasa `dayId`, al volver atrás se limpia el estado
- [x] Aplicar tokens de diseño existentes (`spacing`, `typography`, `radii`, `colors`) + fondo oscuro

### Phase 2: Carrusel de ejercicios + Selector de peso (WeightPicker) + DB de sesiones ✅
- [x] Añadir tablas `workout_sessions` y `session_sets` a `initDatabase` en `src/server/database/index.ts`
- [x] Añadir tipos `WorkoutSession` y `SessionSet` a `src/constants/types.ts`
- [x] Añadir queries DB: `createSession(dayId)`, `logSet(sessionId, exerciseId, setIndex, weight, rirLabel)`, `getSessionSets(sessionId, exerciseId)`, `getLastWeightForExercise(exerciseId)`, `completeSession`
- [x] Crear `src/screens/workout-ongoing/exercise-carousel.tsx`: FlatList horizontal con snap, muestra ej. anterior/actual/siguiente con previsualización parcial a los lados
- [x] Crear `src/screens/workout-ongoing/weight-picker.tsx`: dos columnas verticales con `ScrollView` + snap (enteros 0-200, decimales 00/25/50/75), valor combinado mostrado en turquesa brillante
- [x] Integrar carrusel en la pantalla principal, debajo del cronómetro, con flechas de navegación izquierda/derecha
- [x] Integrar WeightPicker debajo del carrusel, con cabecera "PESO (KG)" e icono de pesa
- [x] Cargar último peso registrado para el ejercicio actual como valor inicial del picker

### Phase 3: Botones de acción + Temporizador de descanso + Finalización + Modificar registro ✅
- [x] Crear `src/screens/workout-ongoing/action-bar.tsx`: 4 botones grandes (FALLO/rojo, RIR 1/morado, RIR 2/morado, ACABAR EJERCICIO/verde) con iconos
- [x] Al pulsar cualquier botón: guardar `session_set` en DB con peso actual + etiqueta RIR + timestamp
- [x] Crear `src/screens/workout-ongoing/rest-timer.tsx`: cuenta atrás configurable (60/90/120s desde Ajustes), botón "INICIAR DESCANSO" tipo pill con glow, indicador "Descanso: MM:SS" en turquesa, botones +/- 10s, pitido últimos 3s (usar `expo-av`)
- [x] Flujo de finalización: detectar "Siguiente ejercicio" en el último ejercicio → si hay pendientes sin registrar, mostrar lista y preguntar; si no, pasar a finalización
- [x] Crear `src/screens/workout-ongoing/completion-modal.tsx`: modal con animación de confeti, mensaje de felicitación, tiempo total, recordatorio de estirar, botón "Volver" → marca sesión completada en DB → navega a DayDetail
- [x] "Modificar registro": pantalla/modal que lista todas las session_sets del ejercicio actual, permite borrar, editar peso/RIR, y reordenar
- [x] Al completar todos los ejercicios, cronómetro se detiene automáticamente y se activa flujo de finalización

---

## Next step
Todas las fases completadas.
