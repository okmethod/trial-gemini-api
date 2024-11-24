/* eslint-disable @typescript-eslint/no-require-imports */
const js = require("@eslint/js");
const ts = require("typescript-eslint");
const globals = require("globals");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  js.configs.recommended,
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
