/* eslint-disable @typescript-eslint/no-require-imports */
const js = require("@eslint/js");
const ts = require("typescript-eslint");
const prettier = require("eslint-config-prettier");
const globals = require("globals");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  js.configs.recommended,
  prettier,
  ...ts.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: [
      ".DS_Store",
      "node_modules",
      "build",
      "package",
      "lib",
      ".env",
      ".env.*",
      "!env.example",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
    ],
  },
];
