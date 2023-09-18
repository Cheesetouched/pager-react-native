module.exports = {
  env: {
    node: true,
  },
  extends: [
    "universe/native",
    "plugin:react-hooks/recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  root: true,
  rules: {
    "import/order": "off",
  },
};
