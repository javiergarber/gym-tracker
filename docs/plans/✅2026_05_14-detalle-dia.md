# Feature: Detalle del día (Day Detail)

## Summary
Pantalla que muestra los ejercicios de un día concreto con sus series y repeticiones, con botones para ver el histórico de cada ejercicio e iniciar el entrenamiento.

## Phases

### Phase 1: DB ✅
- [x] Añadir `getDayById(dayId)` que devuelva los datos del día (name, subtitle)
- [x] Añadir `getDayExercises(dayId)` que devuelva ejercicios con sus sets, ordenados por `sort_order`
- [x] Añadir tipos `Day`, `ExerciseSet` y `ExerciseWithSets` a `types.ts`

### Phase 2: UI de DayDetailScreen ✅
- [x] Reemplazar placeholder: cargar día y ejercicios desde DB
- [x] Mostrar nombre del día como título dinámico
- [x] Mostrar lista de ejercicios con `FlatList` (nombre + "series × reps")
- [x] Cada ejercicio con botón "Historial" (navega a ExerciseHistory con exerciseId)
- [x] Botón "Comenzar" que inicia la sesión (acción preparada para uso futuro)
- [x] Añadir ruta `ExerciseHistory` a navigation types + placeholder screen
- [x] Aplicar tokens de diseño (spacing, typography, radii, colores)

### Phase 3: Unificación de headers y parpadeo blanco ✅
- [x] Cambiar `userInterfaceStyle` de `"light"` a `"dark"` en `app.json` (fondo ventana Android oscuro)
- [x] Crear `ThemedNavigationContainer` en `_layout.tsx` con tema de NavigationContainer sincronizado
- [x] Instalar y configurar `expo-system-ui` para fondo de ventana Android dinámico
- [ ] ~~Unificar estilo: body header (h1 + línea degradada) en todas las pantallas~~ (refactor futuro)
- [x] Quitar título duplicado de la barra de navegación (`title: ""`)
- [ ] ~~Botón de atrás nativo (sin hápticos) para evitar parpadeo~~ (comportamiento por defecto)

---

✅ **Finalizado**
