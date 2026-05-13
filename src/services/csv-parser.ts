export interface ParsedExercise {
  name: string
  series: string
  reps: string
}

export interface ParsedDay {
  name: string
  subtitle: string | null
  exercises: ParsedExercise[]
}

export interface ParsedCSV {
  days: ParsedDay[]
}

export interface CSVParseError {
  message: string
  row?: number
}

function cleanCell(cell: string): string {
  return cell.trim().replace(/^"|"$/g, "").trim()
}

function isNumericOrRange(value: string): boolean {
  return /^\d+(-\d+)?$/.test(value)
}

export function parseCSV(content: string): ParsedCSV {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0)
  if (lines.length < 4) {
    throw { message: "El archivo debe tener al menos 4 filas (días, grupos, encabezados y datos)" } as CSVParseError
  }

  const delimiter = lines[0].includes("\t") ? "\t" : ","

  const rows = lines.map((line) => {
    const cells: string[] = []
    let current = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === delimiter && !inQuotes) {
        cells.push(current)
        current = ""
      } else {
        current += char
      }
    }
    cells.push(current)
    return cells.map(cleanCell)
  })

  const dayColumns: number[] = []
  for (let i = 0; i < rows[0].length; i++) {
    if (rows[0][i]) dayColumns.push(i)
  }
  if (dayColumns.length === 0) {
    throw { message: "No se encontraron nombres de días en la primera fila" } as CSVParseError
  }

  const colsPerDay = dayColumns.length > 1 ? dayColumns[1] - dayColumns[0] : 2

  const dayNames: string[] = []
  const subtitles: (string | null)[] = []

  for (const col of dayColumns) {
    dayNames.push(rows[0][col])
    subtitles.push(rows[1]?.[col] || null)
  }

  const dataRows = rows.slice(3)
  const days: ParsedDay[] = dayNames.map((name, dayIdx) => {
    const baseCol = dayColumns[dayIdx]
    const exercises: ParsedExercise[] = []

    for (let rowIdx = 0; rowIdx < dataRows.length; rowIdx++) {
      const row = dataRows[rowIdx]
      const exerciseName = row[baseCol] || ""
      const series = row[baseCol + 1] || ""
      const reps = colsPerDay >= 3 ? row[baseCol + 2] || "" : ""

      if (!exerciseName || !series) continue
      if (exerciseName.toLowerCase() === "ejercicio") continue

      exercises.push({
        name: exerciseName,
        series: isNumericOrRange(series) ? series : series,
        reps,
      })
    }

    return { name, subtitle: subtitles[dayIdx], exercises }
  })

  return { days }
}
