module.exports = {
  root: true,
  extends: [
    "universe/native",
    "plugin:react-hooks/recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  rules: {
    "import/order": "off",
  },
};
