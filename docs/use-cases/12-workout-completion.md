# Finalización del entrenamiento

## Descripción
El sistema no tiene en cuenta las series o repeticiones para determinar el entrenamiento como completado. El usuario avanza entre ejercicios manualmente mediante el carrusel o los botones de acción. Si al llegar al último ejercicio del carrusel se pulsa "Siguiente ejercicio", el sistema detecta si hay ejercicios que no se han registrado (saltados) y pregunta al usuario si quiere hacerlos antes de finalizar.

## Flujo normal
1. El usuario navega entre ejercicios libremente deslizando el carrusel
2. Realiza las series que quiere, pulsando los botones de acción para registrar
3. Cuando llega al último ejercicio del día y pulsa "Siguiente ejercicio":
   - Si no hay ejercicios pendientes → pasa a la finalización con confeti
   - Si hay ejercicios saltados → muestra un mensaje con los pendientes

## Flujo con ejercicios pendientes
1. Al pulsar "Siguiente" en el último ejercicio, el sistema detecta ejercicios sin registrar
2. Aparece un mensaje listando los ejercicios que faltan (ej: "Faltan: Press banca, Remo")
3. Pregunta: "¿Quieres hacerlos ahora?"
4. Si elige "Sí" → navega al primer ejercicio pendiente, y al pulsar "Siguiente" irá saltando entre los pendientes
5. Si elige "No" → pasa directamente a la finalización con confeti

## Finalización
1. Se detiene el cronómetro
2. Aparece una animación de confeti en pantalla
3. Se muestra un modal de felicitación
4. El modal incluye un mensaje recordando estirar
5. El usuario cierra el modal y vuelve al detalle del día

## Acceptance Criteria
- El sistema no obliga a completar series ni repeticiones; el usuario decide cuándo avanzar
- El carrusel permite navegar a cualquier ejercicio en cualquier orden
- Solo se consideran ejercicios "completados" aquellos en los que se ha pulsado un botón de acción al menos una vez
- Al pulsar "Siguiente ejercicio" en el último ejercicio del día:
  - Si todos los ejercicios tienen al menos un registro → finalización directa
  - Si hay ejercicios sin registrar → muestra lista de pendientes y pregunta
- La lista de pendientes muestra los nombres de los ejercicios sin registrar
- Si el usuario elige "Sí", se le lleva al primer ejercicio pendiente y "Siguiente ejercicio" navegará secuencialmente entre los pendientes
- Si el usuario elige "No", pasa a finalización
- Al finalizar: el cronómetro se detiene, aparece confeti (2-3s), y un modal con:
  - Mensaje de felicitación (ej: "¡Entrenamiento completado!")
  - Tiempo total de la sesión
  - Recordatorio: "No olvides estirar"
  - Botón "Volver" para cerrar y regresar al detalle del día
- La sesión se marca como completada en la base de datos
- El diseño del confeti y el modal es alegre y motivador, acorde al tema visual
