// If you are using Firebase version 9.7.x and above,
// you need to add the following configuration to a metro.config.js
// file to make sure that the Firebase JS SDK is bundled correctly.

const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push("cjs");

module.exports = defaultConfig;
