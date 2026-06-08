// packages/hooks/jest.config.ts
import type { JestConfigWithTsJest } from "ts-jest";
import { createDefaultPreset } from "ts-jest";

const tsJestPreset = createDefaultPreset({
  tsconfig: {
    moduleResolution: "node16",
    ignoreDeprecations: "6.0",
  },
  // Tell ts-jest to also handle .mjs files
  extensionsToTreatAsEsm: [],
});

const config: JestConfigWithTsJest = {
  displayName: "hooks",
  testEnvironment: "jest-environment-jsdom",
  ...tsJestPreset,
  // Runs before test environment is set up — safe place for globals
  setupFiles: ["<rootDir>/jest.globals.ts"],
  // Runs after — safe place for jest-dom matchers
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Transform .mjs files too, not just .js/.ts
  transform: {
    "^.+\\.m?[jt]sx?$": [
      "ts-jest",
      {
        tsconfig: {
          moduleResolution: "node16",
          ignoreDeprecations: "6.0",
        },
      },
    ],
  },

  transformIgnorePatterns: [
    "node_modules/(?!(msw|@mswjs|@open-draft|rettime|until-async|headers-polyfill|outvariant|strict-event-emitter|is-node-process|set-cookie-parser)/)",
  ],

  moduleNameMapper: {
    "^@gymtracker/types$": "<rootDir>/../../packages/types/src/index.ts",
    "^@gymtracker/api-client$":
      "<rootDir>/../../packages/api-client/src/index.ts",
    "^@gymtracker/hooks$": "<rootDir>/../../packages/hooks/src/index.ts",
    "^@gymtracker/stores$": "<rootDir>/../../packages/stores/src/index.ts",
    "^@gymtracker/constants$":
      "<rootDir>/../../packages/constants/src/index.ts",
    "^@gymtracker/utils$": "<rootDir>/../../packages/utils/src/index.ts",
    "^@gymtracker/utils/(.*)$": "<rootDir>/../../packages/utils/src/$1",
  },

  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.ts?(x)"],
};

export default config;
