# Home — Lista de entrenamientos

## Descripción
La pantalla principal de la aplicación muestra todos los entrenamientos disponibles. El usuario puede ver la lista y seleccionar uno para ver su detalle o comenzar a entrenar.

## Flujo
1. Al abrir la app, se carga la pantalla Home
2. Si hay entrenamientos, se muestran en formato de lista
3. Si no hay entrenamientos, se muestra un mensaje y un botón para crear uno
4. El usuario pulsa sobre un entrenamiento para ver su detalle
5. El usuario pulsa "Nuevo entrenamiento" para importar un CSV
6. Hay un icono de Ajustes accesible desde la Home

## Acceptance Criteria
- La pantalla principal muestra una lista de entrenamientos ordenados por fecha de creación (más reciente primero)
- Cada entrenamiento se muestra como una tarjeta con su nombre
- Al pulsar un entrenamiento se navega al detalle del mismo
- **Estado vacío**: si no hay entrenamientos, se muestra el texto "No hay entrenamientos todavía, ¡crea uno!" y un botón "Nuevo entrenamiento"
- **Siempre visible**: un botón "Nuevo entrenamiento" en la parte superior o inferior de la pantalla para importar un CSV
- Hay un icono de Ajustes accesible desde la Home
- La interfaz es limpia, moderna y colorida acorde al tema seleccionado
