# File Structure Guide

Árbol de directorios y reglas para organizar el código del proyecto.

```
gym-tracker/
├── assets/                   # Archivos estáticos (imágenes, iconos, fuentes)
├── scripts/                  # Scripts de automatización y utilidad
├── src/
│   ├── app/                  # Capa de entrada y navegación
│   │   ├── index.ts          #   Entry point (registerRootComponent)
│   │   ├── _layout.tsx       #   Layout raíz (providers + NavigationContainer)
│   │   ├── navigator.tsx     #   Stack navigator con rutas
│   │   └── navigator.types.ts
│   ├── components/           # Componentes UI reutilizables entre pantallas
│   │   └── *.tsx
│   ├── constants/            # Constantes, tokens de diseño, tipos globales
│   │   ├── theme.ts          #   Temas (colores)
│   │   ├── tokens.ts         #   Espaciado, tipografía, radios
│   │   └── types.ts          #   Tipos compartidos (Workout, etc.)
│   ├── hooks/                # Hooks y contextos de React reutilizables
│   │   ├── use-database.tsx  #   DatabaseProvider + useDatabase
│   │   ├── use-theme.tsx     #   ThemeProvider + useTheme
│   │   └── dev-provider.tsx  #   DevProvider (solo dev)
│   ├── screens/              # Pantallas completas de la app
│   │   ├── home/             #   Pantalla Home + subcomponentes privados
│   │   │   └── index.tsx
│   │   ├── day-detail.tsx
│   │   ├── settings.tsx
│   │   └── workout-detail.tsx
│   └── server/               # Lógica de negocio / backend
│       └── database/          #   Capa de datos
│           ├── index.ts       #     DB client + queries
│           ├── csv-parser.ts  #     Parseador CSV
│           └── seed.ts        #     Datos de ejemplo (dev)
├── app.json
└── package.json
```

## Reglas por carpeta

| Carpeta | Qué va ahí |
|---|---|
| `app/` | Layout raíz, navegación, ficheros de ruta mínimos |
| `components/` | Componentes UI reutilizables en 2+ pantallas |
| `constants/` | Valores fijos, tipos, tokens de diseño |
| `hooks/` | Hooks + contextos React compartidos |
| `screens/` | Pantallas completas; cada carpeta = 1 ruta |
| `server/` | DB, csv-parser, seed — lógica sin UI |

## Reglas generales

- **Componente reutilizable** → `components/`
- **Usado solo en una pantalla** → dentro de esa carpeta en `screens/`
- **Función pura / helper** → `server/` (o `utils/` si se crea)
- **Lógica React reutilizable** → `hooks/`
- **Constantes / tipos globales** → `constants/`
- **Ficheros en kebab-case** (`mi-componente.tsx`), excepto carpetas de ruta (`home/index.tsx`)
- **`.web.tsx`** para variantes web específicas si es necesario
- **Imports con alias `@/`** — `@/components/foo` resuelve a `src/components/foo`. Usar siempre en lugar de rutas relativas largas.
