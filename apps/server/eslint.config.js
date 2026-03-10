import neko from '@neko/eslint-config'
import { config } from 'typescript-eslint'

export default config(
  {
    ignores: ['**/*', '!src/**', '!contract-tests/**', '!integration-tests/**'],
    extends: [
      ...neko,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json'],
        },
      },
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
    },
  },
)
