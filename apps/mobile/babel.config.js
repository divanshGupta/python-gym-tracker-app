module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      [
        "module-resolver",
        {
          alias: {
            "@gymtracker/api-client":      "../../packages/api-client/src/index.ts",
            "@gymtracker/constants":       "../../packages/constants/src/index.ts",
            "@gymtracker/stores":          "../../packages/stores/src/index.ts",
            "@gymtracker/types":           "../../packages/types/src/index.ts",
            "@gymtracker/hooks":           "../../packages/hooks/src/index.ts",
            "@gymtracker/tailwind-config": "../../packages/tailwind-config",
          },
        },
      ],
    ],
  };
};