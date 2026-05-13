# Sesión de entrenamiento activa

## Descripción
Pantalla principal durante la realización del entrenamiento. Muestra un cronómetro con el tiempo transcurrido, un carrusel de ejercicios (anterior, actual, siguiente) navegable mediante deslizamiento horizontal, y los controles para registrar cada serie.

## Flujo
1. El usuario inicia el entrenamiento desde el detalle del día o del workout
2. Se abre la pantalla de sesión activa con el cronómetro corriendo
3. Se muestra el primer ejercicio en el carrusel
4. El usuario puede deslizar horizontalmente para ver anterior/siguiente ejercicio
5. El usuario puede pausar/reanudar/parar el entrenamiento desde el menú de opciones
6. Desde el menú de opciones también puede acceder a "Modificar registro" para gestionar los datos del ejercicio actual
7. Al realizar una acción sobre el ejercicio, se registra y avanza

## Acceptance Criteria
- El cronómetro se inicia automáticamente al entrar
- Cronómetro visible en la parte superior con formato HH:MM:SS
- Botón de opciones (tres puntos o hamburguesa) que despliega: Pausar, Reanudar, Parar entrenamiento, Modificar registro
- Carrusel de ejercicios: se muestra el ejercicio actual a pantalla completa, con previsualización del anterior y siguiente a los lados
- El deslizamiento horizontal permite moverse entre ejercicios libremente (no solo en orden)
- Si se pausa, el cronómetro se detiene y se reanuda al despausar
- Si se para el entrenamiento, se confirma la acción y se vuelve al detalle del día
- Al completar todos los ejercicios, el cronómetro se detiene automáticamente y se activa el flujo de finalización
- "Modificar registro" abre una vista donde el usuario puede borrar registros del ejercicio actual, modificar el peso o RIR de una serie existente, o reordenar las series
- Los cambios realizados en "Modificar registro" se guardan en la base de datos
- El diseño es limpio, con colores del tema activo, y prioriza la legibilidad durante el esfuerzo
