# Selector de peso

## Descripción
Control para seleccionar el peso levantado durante una serie. Consta de dos carruseles verticales: uno para la parte entera del número y otro para la parte decimal. El peso seleccionado se utiliza al pulsar los botones de acción.

## Flujo
1. Durante la sesión activa, el selector de peso aparece debajo del carrusel de ejercicios
2. El usuario hace scroll en el carrusel izquierdo para cambiar la parte entera (ej: 0 a 200)
3. El usuario hace scroll en el carrusel derecho para cambiar la parte decimal (ej: .0, .5)
4. El peso combinado se muestra en grande entre los dos carruseles
5. Al pulsar un botón de acción, se guarda el peso seleccionado

## Acceptance Criteria
- Dos carruseles verticales independientes: entero (0-200) y decimal (.0 / .5)
- Cada carrusel muestra varios valores visibles, con el valor seleccionado centrado y resaltado
- El peso combinado se muestra en formato "XX.X kg" debajo o entre los carruseles
- Los carruseles hacen snap al valor más cercano al soltar
- El valor inicial del carrusel se carga desde el último peso registrado para ese ejercicio (si existe)
- Los carruseles son fáciles de usar con el pulgar durante el entrenamiento
