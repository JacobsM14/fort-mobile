# Gym Tracker

Mobile app to track gym routines and workouts. Offline-first: all data lives in a local SQLite database for now. A backend API is planned, so the data layer must be easy to swap or extend.

## Stack

- React Native with Expo, TypeScript (strict)
- Local DB: SQLite via expo-sqlite
- Navigation: <Expo Router | React Navigation>
- Styles: design tokens (colors, spacing, typography) live in `src/constants/theme.ts`; never hardcode them elsewhere

## Commands

- `npx expo start`: start the app
- `npx tsc --noEmit`: type check (run before finishing a task)
- `npm run lint`: lint (if configured)

## Architecture

- `src/components`: reusable UI · `src/screens`: screens · `src/hooks`: custom hooks · `src/db`: schema, migrations, repositories · `src/types`: domain types
- Data flow: components → hooks → repositories → SQLite. UI code never calls SQLite directly. When the API arrives, only the repositories change.
- Domain types are independent of DB row shapes.
- Use string ids (UUID), not autoincrement, and keep `created_at` / `updated_at` on every table to ease future sync.
- Schema changes go through versioned migrations.

## Conventions

- Functional components with hooks
- No `any`; type props and return values
- Comment only where the code isn't self-explanatory: explain the why, not the what. Comments always in English
- No emojis in code, comments or commits
- Commits in English, Conventional Commits format (`feat:`, `fix:`...)

## What NOT to do

- Do not install libraries without asking first
- Do not `git push`; the user does it
- Do not make destructive DB changes (dropping tables or columns, wiping data) without asking
