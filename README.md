# FortApp

App para registrar entrenamientos de gimnasio. Expo (SDK 57) + Expo Router.

## Arrancar

```bash
npm install
npx expo start
```

## Comprobar

```bash
npx tsc --noEmit   # tipos
npm run lint       # lint
npm test           # tests (Jest)
```

Los tests de datos ejecutan las consultas reales sobre una base SQLite en memoria (`node:sqlite`, Node 22.5 o superior) con las mismas migraciones que la app.

## Estructura

```
src/
├── app/                # Rutas (Expo Router): solo pantallas y _layout.tsx
├── features/           # Una carpeta por área: datos del catálogo, tipos y acceso a datos
│   ├── exercises/      # Catálogo de ejercicios y ejercicios propios
│   ├── routines/       # Rutinas
│   └── settings/       # Preferencias guardadas (tema, color)
├── components/         # UI reutilizable (ui/ genérica; exercises/, today/… por área)
├── hooks/              # Hooks genéricos, no ligados a una feature
├── constants/          # Tema (colores, espaciados), enums y datos de la app
├── utils/              # Funciones puras (fechas, texto, listas)
├── db/                 # Base de datos local: conexión, esquema y migraciones
└── test/               # Utilidades para los tests
assets/                 # Icono, splash e imágenes
```

Las pantallas (`app/`) y los componentes no acceden directamente a `db/`: lo hacen a través del código de cada feature. Así, cuando se añada la red, solo cambia esa capa y la UI queda igual.

Los imports usan el alias `@/`, que apunta a `src/` (por ejemplo, `@/features/routines/queries`).
