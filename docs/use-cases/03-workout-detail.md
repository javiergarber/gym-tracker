# Detalle del entrenamiento

## Descripción
Muestra la información completa de un entrenamiento y los días que lo componen. Desde aquí el usuario puede explorar los días y seleccionar uno para ver su detalle. El inicio del entrenamiento se realiza desde el detalle del día.

## Flujo
1. El usuario llega desde la Home pulsando un entrenamiento
2. Se muestra el nombre del entrenamiento en la cabecera
3. Debajo se listan los días que componen el entrenamiento (ej: "Día 1", "Día 2"...)
4. Cada día es un elemento seleccionable que navega al detalle del día

## Acceptance Criteria
- Se muestra el nombre del entrenamiento como título
- Los días se muestran en orden (según el orden definido en el CSV)
- Cada día muestra su nombre y puede tener un subtítulo opcional
- Al pulsar un día se navega al detalle de ese día (donde está el botón "Comenzar")
- Se puede volver atrás a la Home
