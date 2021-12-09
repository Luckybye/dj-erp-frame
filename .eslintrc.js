module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "standard",
    // 'eslint:recommended',
    // '@vue/prettier'
  ],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "object-curly-spacing": "off",
    camelcase: "off",
    "eol-last": "off",
    semi: "off",
    "no-callback-literal": "off",
    "comma-dangle": "off",
    "object-property-newline": "off",
    "space-before-function-paren": "off",
    quotes: "off",
    "no-tabs": "off",
    "prefer-const": "off",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        mocha: true,
      },
    },
  ],
};
