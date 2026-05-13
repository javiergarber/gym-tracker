# Gym Tracker

## Language
- Always communicate with the user in Spanish from Spain (español de España, con vosotros y castellano peninsular), even though code, files, and skills may be in English.

## Stack
- Expo SDK 54 + TypeScript (strict)
- React Native 0.81 + New Architecture enabled
- react-native-web for web target

## Entrypoints
- `index.ts` → `App.tsx` (root component)

## Commands
| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run web` | Start with web support |
| `npm run android` | Start + launch Android |
| `npm run ios` | Start + launch iOS (macOS only) |

- Dev server at `http://localhost:8081`

## Project conventions
- `docs/plans/` — architecture plans and design docs
- `docs/use-cases/` — feature tasks and requirements for agent reference
- `.vscode/launch.json` — VS Code run configs (Start Expo, Web, Android)

## Notes
- No lint, test, or CI setup yet
- Run `npx expo install <pkg>` for compatible native packages
- Compatible with Expo Go for rapid testing on device

## Plan management
- When finalizing a plan in `docs/plans/`, mark all checkboxes as `[x]`, add a `✅ **Finalizado**` status line, and prefix the filename with `✅` (e.g. `✅2026_05_13-importar-csv.md`).
