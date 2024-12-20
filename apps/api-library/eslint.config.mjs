import neko from "@neko/eslint-config";

export default [
  ...neko,
  {
    ignores: [
      '**/*',
      '!src/**',
      '!contract-tests/**',
      '!integration-tests/**'
    ]
  },
  {
    files: [
      "**/*.spec.ts"
    ],
    rules: {
      "@typescript-eslint/unbound-method": "off"
    }
  }
];
