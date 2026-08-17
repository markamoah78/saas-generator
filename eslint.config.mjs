import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "convex/_generated/**",
      "coverage/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // The project intentionally keeps a couple of rules relaxed for a
      // boilerplate: teams can tighten these once real code lands.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
