# FortApp

App para registrar entrenamientos de gimnasio. Expo (SDK 57) + Expo Router.

## Arrancar

```bash
npm install
npx expo start
```

## Estructura

```
src/
├── app/                # Rutas (Expo Router): solo pantallas y _layout.tsx
├── features/           # Una carpeta por área de la app: sus componentes, hooks, tipos y acceso a datos
│   ├── exercises/      # Catálogo de ejercicios
│   └── workouts/       # Entrenamientos: series, repeticiones, peso
├── components/         # UI genérica reutilizable (botones, inputs, tarjetas…)
├── hooks/              # Hooks genéricos, no ligados a una feature
├── constants/          # Tema (colores, espaciados) y valores fijos
├── utils/              # Funciones puras (fechas, unidades, cálculo de 1RM…)
├── db/                 # Base de datos local: conexión, esquema y migraciones
└── api/                # Red (más adelante): cliente HTTP, autenticación, sincronización
assets/                 # Icono, splash e imágenes
```

Las pantallas (`app/`) y los componentes no acceden directamente a `db/` ni a `api/`: lo hacen a través del código de cada feature. Así, cuando se añada la red, solo cambia esa capa y la UI queda igual.

Los imports usan el alias `@/`, que apunta a `src/` (por ejemplo, `@/features/workouts/...`).
