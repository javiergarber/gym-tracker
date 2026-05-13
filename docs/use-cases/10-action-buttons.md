# Botones de acción (Fallo, RIR, Siguiente)

## Descripción
Cuatro botones que permiten al usuario registrar el resultado de cada serie. Al pulsar cualquiera de ellos, se guarda el peso seleccionado en el selector junto con una etiqueta que indica la intensidad del esfuerzo. Después de guardar, se avanza automáticamente al siguiente ejercicio o se completa la sesión si era el último.

## Botones
- **Fallo**: se llegó al fallo muscular en esa serie
- **0-1 RIR**: quedaban 0-1 repeticiones en reserva
- **2+ RIR**: quedaban 2 o más repeticiones en reserva
- **Siguiente ejercicio**: guarda con etiqueta "0-1" por defecto y avanza (útil para calentamiento o series de aproximación)

## Flujo
1. El usuario selecciona el peso con el WeightPicker
2. Pulsa uno de los cuatro botones
3. El sistema guarda en base de datos: ejercicio, peso, etiqueta RIR, timestamp
4. Se avanza automáticamente al siguiente ejercicio en la lista
5. Si era el último ejercicio, se activa el flujo de finalización del entrenamiento

## Acceptance Criteria
- Los cuatro botones están visibles y accesibles durante la sesión
- Cada botón tiene un color o icono distintivo para diferenciarlos rápidamente
- Al pulsar un botón, se guarda el registro en la base de datos de forma inmediata
- Después de guardar, la interfaz avanza al siguiente ejercicio (o completa la sesión)
- Si el usuario quiere repetir el mismo ejercicio (multi-series), debe poder navegar de vuelta con el carrusel
- Feedback háptico o visual al guardar (opcional)
