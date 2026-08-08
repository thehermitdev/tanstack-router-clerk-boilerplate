// @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "src/routeTree.gen.ts",
      "eslint.config.js",
      "prettier.config.js",
      "src/shared/components/ui/**/*",
      "#/shared/components/ui/**/*",
    ],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message:
                "Use the shared HTTP client instead of importing Axios directly.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/shared/api/http-client.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["#/app/**", "#/features/**", "#/routes/**"],
              message:
                "Shared code must not depend on app, routes, or feature implementation.",
            },
          ],
        },
      ],
    },
  },
];
