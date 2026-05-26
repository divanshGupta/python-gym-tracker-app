module.exports = function(api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          extensions: [".tsx", ".ts", ".js", ".json"],
          alias: {
            "@gymtracker/stores": "../../packages/stores/src",
            "@gymtracker/hooks": "../../packages/hooks/src",
            "@gymtracker/constants": "../../packages/constants/src",
            "@gymtracker/types": "../../packages/types/src",
            "@gymtracker/api-client": "../../packages/api-client/src",
            "@gymtracker/tailwind-config": "../../packages/tailwind-config",
          },
        },
      ],
      "nativewind/babel",
      "react-native-reanimated/plugin",
    ],
  };
};