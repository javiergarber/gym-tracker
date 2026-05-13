# Importar CSV con entrenamientos

## Descripción
El usuario puede importar un archivo CSV desde el dispositivo que contiene los ejercicios, series y repeticiones organizados por días de la semana. El sistema parsea el archivo y crea automáticamente los entrenamientos, días, ejercicios y series en la base de datos local.

## Formato esperado del CSV
El archivo debe contener al menos las siguientes columnas:
- **día**: nombre del día (ej: "Día 1", "Día 2", o "Lunes", "Martes", etc.)
- **ejercicio**: nombre del ejercicio
- **series**: número de series
- **repeticiones**: número de repeticiones por serie

## Flujo
1. El usuario pulsa el botón "Nuevo entrenamiento" desde la Home
2. Se abre un diálogo para escribir el nombre del entrenamiento (ej: "Junio 2026", "Semana 1", etc.)
3. Después de escribir el nombre, se abre el selector de archivos del dispositivo
4. Selecciona un archivo CSV
5. El sistema valida y parsea el contenido
6. Los datos se guardan en la base de datos con el nombre asignado
7. Se muestra un mensaje de éxito y el entrenamiento aparece en la Home

## Acceptance Criteria
- En la Home hay un botón "Nuevo entrenamiento" visible y accesible
- Al pulsarlo aparece un diálogo para introducir el nombre del entrenamiento
- El nombre es obligatorio; si no se introduce, el botón de confirmación está deshabilitado
- Después de poner el nombre, se abre el selector de archivos del dispositivo para elegir un CSV
- El sistema parsea correctamente el archivo y crea los registros necesarios (workouts, days, exercises, sets)
- Si el archivo tiene un formato inválido, se muestra un mensaje de error claro
- Si se importa el mismo archivo dos veces, se crean entrenamientos duplicados (no hay validación de unicidad)
- Los datos importados persisten y aparecen en la Home inmediatamente
- Mientras se procesa el archivo, se muestra un indicador de carga
