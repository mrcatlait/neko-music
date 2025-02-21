import neko from "@neko/eslint-config";

export default [
  ...neko,
  {
    ignores: [
      '**/*',
      '!src/**',
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
