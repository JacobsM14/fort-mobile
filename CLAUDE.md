# Gym Tracker

Mobile app to track gym routines and workouts. Offline-first: all data lives in a local SQLite database for now. A backend API is planned, so the data layer must be easy to swap or extend.

## Stack

- React Native with Expo, TypeScript (strict)
- Local DB: SQLite via expo-sqlite, accessed through Drizzle ORM
- Navigation: Expo Router (file-based routes in `src/app`)
- Styles: design tokens (colors, `spacing`, `fontSizes`, `lineHeights`, `radii`, `iconSizes`) live in `src/constants/theme.ts`; never hardcode them elsewhere
- Translations: `src/i18n` (`es.ts` defines the `Translations` type, `en.ts` must match it)

## Commands

- `npx expo start`: start the app
- `npx tsc --noEmit`: type check (run before finishing a task)
- `npm run lint`: lint (ESLint via `expo lint`)
- `npm test`: tests (Jest); data tests run the real queries on an in-memory SQLite database
- `npm run images`: regenerate `src/features/exercises/images.ts` after adding or removing files in `assets/exercises`

## Architecture

- `src/app`: routes and screens (Expo Router) · `src/features/<area>`: everything for one area of the app (catalog data, domain types, data access) · `src/components`: reusable UI · `src/hooks`: generic hooks · `src/constants`: theme tokens, enums, app info · `src/utils`: pure helpers · `src/db`: client, schema, migrations
- `src/features/<area>/queries.ts` is the repository layer: Drizzle queries plus the live-query hooks the UI reads from.
- Data flow: screens and components → feature hooks and functions → Drizzle → SQLite. UI code never calls SQLite or Drizzle directly (the root layout only runs `useDatabase` to migrate on startup).
- Offline-first: SQLite stays the source of truth for the UI. When the API arrives, a sync layer writes to SQLite and the UI keeps reading local data; only the feature data layer changes.
- Domain types are independent of DB row shapes.
- Use string ids (UUID), not autoincrement, and keep `created_at` / `updated_at` on every table to ease future sync.
- Schema changes go through versioned migrations.

## Conventions

- Functional components with hooks
- No `any`; type props and return values
- Comment only where the code isn't self-explanatory: explain the why, not the what. Comments always in English
- No emojis in code, comments or commits
- Order imports in groups separated by a blank line: external packages, components, hooks, services, types (use `import type`), utils, styles/assets
- Never run `git commit` or `git push`; the user does it. When a task changes files, end your reply with a suggested commit message in English, Conventional Commits format (`feat:`, `fix:`...)

## What NOT to do

- Do not install libraries without asking first
- Do not `git push`; the user does it
- Do not make destructive DB changes (dropping tables or columns, wiping data) without asking
- Do not run git commit or git push
