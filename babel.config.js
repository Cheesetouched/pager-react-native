module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@assets": "./assets",
            "@components": "./components",
            "@hooks": "./hooks",
            "@utils": "./utils",
            "@queries": "./queries",
          },
        },
      ],
      "expo-router/babel",
    ],
  };
};
