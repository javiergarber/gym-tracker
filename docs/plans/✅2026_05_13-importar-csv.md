# Feature: Importar CSV con entrenamientos

## Summary
El usuario puede importar un archivo CSV desde el dispositivo para crear entrenamientos completos con días, ejercicios y series en la base de datos local.

## Formato del CSV

El archivo usa un formato ancho con días como columnas. Cada día ocupa 3 columnas: `Ejercicio`, `Series`, `Reps`.

```csv
Lunes,,,Martes,,,Jueves,,,Viernes,,
Espalda + biceps,,,Pecho + tríceps,,,Pierna,,,Hombro + brazo,,
Ejercicio,Series,Reps,Ejercicio,Series,Reps,Ejercicio,Series,Reps,Ejercicio,Series,Reps
Jalon,4,12,Press banca,4,10,Sentadilla,4,10,Press hombro,4,12
Remo polea,4,12,Press inclinado mancuernas,3,10,Extensión cuadriceps,3,12,Elevaciones laterales,3,"3-4"
Remo mancuerna,3,10,Aperturas,3,12,Isquio tumbado,"3-4",12,Curl bíceps,3,12
Biceps barra Z,4,12,Press cerrado,3,10,Aduccion,3,12,Tríceps polea unilateral,3,12
Biceps martillo mancuerna,"3-4",12,Extensión tríceps polea,"3-4",12,Gemelo,4,15
15' cardio,,,10' Cardio,,,Peso muerto (si puedo),3,10,15' Cardio,,
```

**Reglas de parseo:**
- **Fila 1:** nombres de los días (`Lunes`, `Martes`, `Jueves`, `Viernes`) — se extraen de las columnas 1, 4, 7, 10
- **Fila 2:** grupos musculares — se guardan como subtítulo del día (ej: `Espalda + biceps`)
- **Fila 3:** encabezados (`Ejercicio`, `Series`, `Reps`) repetidos por cada día
- **Filas siguientes:** datos — cada bloque de 3 columnas pertenece a un día
- `Series` y `Reps` se guardan como string (permite rangos como `"3-4"`)
- Celdas vacías o ejercicios sin series se ignoran (ej: `15' cardio`)

## Phases

### Phase 1: Implementación completa

- [x] Instalar dependencias: `expo-document-picker`, `expo-sqlite`, `expo-file-system`
- [x] Definir el formato CSV (12 columnas, 3 por día: Ejercicio/Series/Reps)
- [x] Crear esquema DB: tablas `workouts`, `days` (con `subtitle`), `exercises`, `sets` (con `reps` como string)
- [x] Crear `services/csv-parser.ts` — parsear cabeceras con nombres de días, grupos musculares y datos
- [x] Crear `services/database.ts` — inicializar DB e insertar workout completo
- [x] Crear `components/NewWorkoutDialog.tsx` — input de nombre + botón confirmar
- [x] Agregar botón "Nuevo entrenamiento" en Home (`App.tsx`)
- [x] Integrar flujo: botón → diálogo → `expo-document-picker` → parseo → DB → refrescar lista
- [x] Manejar estados: loading (spinner), error (alerta), éxito (notificación)
- [x] Mostrar entrenamiento importado en la Home inmediatamente

---

## Status
✅ **Finalizado** — Todas las fases completadas.
