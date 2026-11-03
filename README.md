# Fort

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
│   ├── workouts/       # Entrenamientos: series, descansos y cronómetros
│   └── settings/       # Preferencias guardadas (tema, color)
├── components/         # UI reutilizable (ui/ genérica; exercises/, workout/… por área)
├── hooks/              # Hooks genéricos, no ligados a una feature
├── constants/          # Tema (colores, espaciados), enums y datos de la app
├── utils/              # Funciones puras (fechas, texto, listas, números, duraciones)
├── db/                 # Base de datos local: conexión, esquema y migraciones
└── test/               # Utilidades para los tests
assets/                 # Icono, splash (fuentes SVG en images/source/) y fotos de ejercicios
```

Las pantallas (`app/`) y los componentes no acceden directamente a `db/`: lo hacen a través del código de cada feature. Así, cuando se añada la red, solo cambia esa capa y la UI queda igual.

Los imports usan el alias `@/`, que apunta a `src/` (por ejemplo, `@/features/routines/queries`).

## Publicar

Las builds para tiendas y testers se hacen con EAS (`eas.json`):

```bash
npx eas-cli build --profile preview      # distribución interna (testers)
npx eas-cli build --profile production   # App Store y Google Play
```

El icono y la splash se generan a partir de los SVG de `assets/images/source/`. Si cambias alguno, vuelve a exportar el PNG con el mismo tamaño (el icono, 1024×1024 y sin transparencia).

Antes de enviar a revisión, en las consolas de las tiendas:

- **Las dos:** URL pública de la política de privacidad (el mismo texto que la pantalla Privacidad). Apple pide además una URL de soporte.
- **App Store Connect:** App Privacy «Data Not Collected», clasificación por edades, notas para el revisor (no hay inicio de sesión) y capturas de iPhone.
- **Play Console:** seguridad de los datos («no se recogen ni comparten datos»), declaración de apps de salud (registro de actividad física), cuestionario de clasificación, público objetivo (no infantil), acceso a la app sin credenciales y sin anuncios. Una cuenta personal nueva necesita una prueba cerrada con al menos 12 testers durante 14 días antes de pasar a producción.
