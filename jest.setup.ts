import { jest } from "@jest/globals";

// jest.mock factories run before the imports are set up, so they require what
// they use.
/* eslint-disable @typescript-eslint/no-require-imports */

// The data layer runs on expo-sqlite, which needs the native app. Tests run
// the same queries on an in-memory SQLite database instead (src/test/db.ts):
// each test file gets its own, with the app's migrations applied.
jest.mock("@/db/client", () => require("@/test/db").createTestDatabase());
jest.mock("@/db/id", () => ({
  newId: () => require("node:crypto").randomUUID(),
}));
// Only useLiveQuery's change listener comes from expo-sqlite in tested code.
jest.mock("expo-sqlite", () => ({
  addDatabaseChangeListener: () => ({ remove: () => {} }),
}));
