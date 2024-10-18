import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  importPlugin.flatConfigs.recommended,
  eslintPluginPrettierRecommended,
  {
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
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
      // Disallow conditionals where the type is always truthy or always falsy
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      // Require private members to be marked as readonly if they're never modified outside of the constructor
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/no-namespace': 'off',
      // Enforce a convention in the order of import statements
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            ['builtin', 'external'],
            ['parent', 'sibling', 'index'],
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
)
