# Feature: Detalle del día (Day Detail)

## Summary
Pantalla que muestra los ejercicios de un día concreto con sus series y repeticiones, con botones para ver el histórico de cada ejercicio e iniciar el entrenamiento.

## Phases

### Phase 1: DB
- [ ] Añadir `getDayById(dayId)` que devuelva los datos del día (name, subtitle)
- [ ] Añadir `getDayExercises(dayId)` que devuelva ejercicios con sus sets, ordenados por `sort_order`
- [ ] Añadir tipos `Day`, `ExerciseSet` y `ExerciseWithSets` a `types.ts`

### Phase 2: UI de DayDetailScreen
- [ ] Reemplazar placeholder: cargar día y ejercicios desde DB
- [ ] Mostrar nombre del día como título dinámico
- [ ] Mostrar lista de ejercicios con `FlatList` (nombre + "series × reps")
- [ ] Cada ejercicio con botón "Historial" (navega a ExerciseHistory con exerciseId)
- [ ] Botón "Comenzar" que inicia la sesión (acción preparada para uso futuro)
- [ ] Añadir ruta `ExerciseHistory` a navigation types + placeholder screen
- [ ] Aplicar tokens de diseño (spacing, typography, radii, colores)

### Phase 3: Unificación de headers y parpadeo blanco
- [ ] Cambiar `userInterfaceStyle` de `"light"` a `"dark"` en `app.json` (fondo ventana Android oscuro)
- [ ] Crear `ThemedNavigationContainer` en `App.tsx` con tema de NavigationContainer sincronizado
- [ ] Instalar y configurar `expo-system-ui` para fondo de ventana Android dinámico
- [ ] Unificar estilo: body header (h1 + línea degradada) en todas las pantallas
- [ ] Quitar título duplicado de la barra de navegación (`title: ""`)
- [ ] Botón de atrás nativo (sin hápticos) para evitar parpadeo

---

## Next step
Comenzar con la implementación de la Fase 1.
