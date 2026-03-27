import neko from '@neko/eslint-config'

export default [
  ...neko,
  {
    ignores: ['**/*', '!codegen.ts', '!plugin/**'],
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
]
