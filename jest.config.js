/** @type {import('jest').Config} */
module.exports = {
  // Also maps the "@/" alias from tsconfig.json.
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.setup.ts"],
};
