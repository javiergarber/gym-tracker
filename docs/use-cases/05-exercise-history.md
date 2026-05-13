# Historial de progresión del ejercicio

## Descripción
Muestra la evolución de un ejercicio a lo largo del tiempo. El usuario puede ver los pesos utilizados, el RIR registrado y las fechas de las sesiones anteriores para evaluar su progreso.

## Flujo
1. El usuario accede desde el detalle del día pulsando "Historial" en un ejercicio
2. Se carga el historial de ese ejercicio ordenado por fecha (más reciente primero)
3. Se muestra una lista con cada entrada de sesión anterior
4. Si no hay historial, se muestra un mensaje indicándolo

## Acceptance Criteria
- Se muestra el nombre del ejercicio como título
- Lista ordenada por fecha de las sesiones anteriores (más reciente primero)
- Cada entrada muestra: fecha, peso utilizado, RIR (Fallo / 0-1 / 2+)
- Si no hay sesiones registradas, se muestra: "Aún no hay historial para este ejercicio"
- Se puede volver atrás al detalle del día
