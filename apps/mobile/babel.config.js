module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      // Resolve workspace package paths
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@gymtracker/types":       "../../packages/types/src/index.ts",
            "@gymtracker/api-client":  "../../packages/api-client/src/index.ts",
            "@gymtracker/hooks":       "../../packages/hooks/src/index.ts",
            "@gymtracker/stores":      "../../packages/stores/src/index.ts",
            "@gymtracker/constants":   "../../packages/constants/src/index.ts",
            "@gymtracker/utils":       "../../packages/utils/src/index.ts",
            "@gymtracker/tailwind-config": "../../packages/tailwind-config/index.js",
          },
        },
      ],
    ],
  };
};