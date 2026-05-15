# Feature: Sesión de entrenamiento activa

## Summary
Pantalla principal durante la realización del entrenamiento con cronómetro, carrusel de ejercicios, selector de peso, botones de acción, temporizador de descanso y flujo de finalización.

## Phases

### Phase 1: Esqueleto de pantalla + Cronómetro + Menú + Navegación
- [ ] Reemplazar placeholder `src/screens/workout-ongoing.tsx` con layout completo: fondo oscuro, barra superior (menú hamburguesa en botón circular semitransparente), cabecera "TIEMPO TOTAL", cronómetro gigante, y botonera inferior
- [ ] Consultar ejercicios del día desde DB (`getDayExercises`) al montar la pantalla
- [ ] Implementar cronómetro con `useEffect` + `setInterval`: arranca solo al entrar, formato `HH:MM:SS`, degrade morado/violeta
- [ ] Botón de opciones (hamburguesa) con menú contextual: "Pausar", "Reanudar", "Parar entrenamiento", "Modificar registro" (placeholder)
- [ ] "Parar entrenamiento": confirmación con `Alert.alert` → `navigation.goBack()`
- [ ] Pausar/Reanudar: detener/reanudar intervalo del cronómetro
- [ ] Navegación: al pulsar "Comenzar" desde DayDetail se pasa `dayId`, al volver atrás se limpia el estado
- [ ] Aplicar tokens de diseño existentes (`spacing`, `typography`, `radii`, `colors`) + fondo negro/azul oscuro con degradado suave

### Phase 2: Carrusel de ejercicios + Selector de peso (WeightPicker) + DB de sesiones
- [ ] Añadir tablas `workout_sessions` y `session_sets` a `initDatabase` en `src/server/database/index.ts`
- [ ] Añadir tipos `WorkoutSession` y `SessionSet` a `src/constants/types.ts`
- [ ] Añadir queries DB: `createSession(dayId)`, `logSet(sessionId, exerciseId, setIndex, weight, rirLabel)`, `getSessionSets(sessionId, exerciseId)`, `getLastWeightForExercise(exerciseId)`
- [ ] Crear `src/screens/workout-ongoing/exercise-carousel.tsx`: FlatList horizontal con snap, muestra ej. anterior/actual/siguiente con previsualización parcial a los lados
- [ ] Crear `src/components/weight-picker.tsx`: dos columnas verticales con `ScrollView` + snap (enteros 0-200, decimales .0/.5/.25/.75), valor combinado mostrado en turquesa brillante
- [ ] Integrar carrusel en la pantalla principal, debajo del cronómetro, con flechas de navegación izquierda/derecha
- [ ] Integrar WeightPicker debajo del carrusel, con cabecera "PESO (KG)" e icono de pesa
- [ ] Cargar último peso registrado para el ejercicio actual como valor inicial del picker

### Phase 3: Botones de acción + Temporizador de descanso + Finalización + Modificar registro
- [ ] Crear `src/screens/workout-ongoing/action-bar.tsx`: 4 botones grandes (FALLO/rojo, RIR 1/morado, RIR 2/morado, ACABAR EJERCICIO/verde) con iconos
- [ ] Al pulsar cualquier botón: guardar `session_set` en DB con peso actual + etiqueta RIR + timestamp
- [ ] Crear `src/screens/workout-ongoing/rest-timer.tsx`: cuenta atrás configurable (60/90/120s desde Ajustes), botón "INICIAR DESCANSO" tipo pill con glow, indicador "Descanso: MM:SS" en turquesa, botones +/- 10s, pitido últimos 3s (usar `expo-av`)
- [ ] Flujo de finalización: detectar "Siguiente ejercicio" en el último ejercicio → si hay pendientes sin registrar, mostrar lista y preguntar; si no, pasar a finalización
- [ ] Crear `src/screens/workout-ongoing/completion-modal.tsx`: modal con animación de confeti, mensaje de felicitación, tiempo total, recordatorio de estirar, botón "Volver" → marca sesión completada en DB → navega a DayDetail
- [ ] "Modificar registro": pantalla/modal que lista todas las session_sets del ejercicio actual, permite borrar, editar peso/RIR, y reordenar
- [ ] Al completar todos los ejercicios, cronómetro se detiene automáticamente y se activa flujo de finalización

---

## Next step
Comenzar con la implementación de la Fase 1.
