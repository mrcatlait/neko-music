import { config, configs as tseslint } from 'typescript-eslint'
import neko from '@neko/eslint-config';
import angular from 'angular-eslint'
import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default config(
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
      '**/*.ts'
    ],
    extends: [
      ...neko,
      ...angular.configs.tsRecommended
    ],
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.spec.json'],
        },
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      // Ensures component's changeDetection is set to ChangeDetectionStrategy.OnPush
      '@angular-eslint/prefer-on-push-component-change-detection': [
        'error'
      ],
      // Disallows using ViewEncapsulation.None
      '@angular-eslint/use-component-view-encapsulation': [
        'error'
      ],
      // Ensures that classes implement lifecycle interfaces corresponding to the declared lifecycle methods
      // https://angular.io/guide/styleguide#style-09-01
      '@angular-eslint/use-lifecycle-interface': [
        'error'
      ],
      // Ensures that input bindings, including aliases, are not named or prefixed by the configured disallowed prefixes
      '@angular-eslint/no-input-prefix': [
        'error',
        {
          'prefixes': [
            'on'
          ]
        }
      ],
      '@angular-eslint/directive-class-suffix': 'off',
      // Classes decorated with @Component must have defined suffix in their name
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/component-selector': [
        'error',
        {
          'type': ['attribute', 'element'],
          'prefix': 'n',
          'style': 'kebab-case'
        }
      ],
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      eslint.configs.recommended,
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      eslintPluginPrettierRecommended
    ],
    rules: {
      "prettier/prettier": ["error", { "parser": "angular" }],
      // Disallows the use of inline styles in HTML templates
      '@angular-eslint/template/no-inline-styles': [
        'error',
        {
          'allowBindToStyle': true
        }
      ],
      // Ensures that HTML attributes and Angular bindings are sorted based on an expected order
      '@angular-eslint/template/attributes-order': [
        'error',
        {
          'alphabetical': true,
          'order': [
            'STRUCTURAL_DIRECTIVE',
            'TEMPLATE_REFERENCE',
            'ATTRIBUTE_BINDING',
            'INPUT_BINDING',
            'TWO_WAY_BINDING',
            'OUTPUT_BINDING'
          ]
        }
      ],
      '@angular-eslint/template/button-has-type': 'warn',
      '@angular-eslint/template/cyclomatic-complexity': ['warn', { maxComplexity: 10 }],
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-ngsrc': 'warn',
      '@angular-eslint/template/prefer-self-closing-tags': 'warn',
      '@angular-eslint/template/use-track-by-function': 'warn',
    }
  }
);
