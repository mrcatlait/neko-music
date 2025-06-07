import prettier from 'eslint-config-prettier'
import js from '@eslint/js'
import { includeIgnoreFile } from '@eslint/compat'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import { fileURLToPath } from 'node:url'
import ts from 'typescript-eslint'
import svelteConfig from './svelte.config.js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url))

export default ts.config(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  prettier,
  ...svelte.configs.prettier,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // 'no-undef': 'off',
      // Disallow the any type.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Disallow returning a value with type any from a function.
      '@typescript-eslint/no-unsafe-return': 'off',
      // Disallow assigning a value with type any to variables and properties.
      '@typescript-eslint/no-unsafe-assignment': 'off',
      // Require explicit accessibility modifiers on class properties and methods
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'no-public',
        },
      ],
      // Disallow variable declarations from shadowing variables declared in the outer scope.
      '@typescript-eslint/no-shadow': 'error',
      // Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/shared/states/*'],
              message: 'Use context providers instead of importing global states directly.',
              allowTypeImports: false,
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/lib/features/**/*'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/**/*'],
              message: 'Features cannot import from other feature domains. Use shared utilities or proper interfaces.',
              allowTypeImports: true,
            },
          ],
          paths: [
            {
              name: '@/features',
              message: 'Import from specific feature domains, not the barrel export.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/lib/shared/**/*'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/**/*'],
              message: 'Shared code cannot import from features. Keep shared code truly independent.',
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: ts.parser,
        svelteConfig,
      },
    },
  },
)
