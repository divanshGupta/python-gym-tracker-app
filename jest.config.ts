// jest.config.ts  (monorepo root)
// This file is an orchestrator only — it does not run tests itself.
// Add new packages/apps here as you add test suites.

export default {
  projects: [
    "<rootDir>/packages/hooks",
    // "<rootDir>/packages/stores",   // add when store tests are written
    // "<rootDir>/apps/web",          // add when component tests are written
  ],
};
