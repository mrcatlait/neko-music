import tseslint from 'typescript-eslint'
import neko from "@neko/eslint-config";
import angular from 'angular-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
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
      "**/*.ts"
    ],
    extends: [
      ...neko,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      // Ensures component's changeDetection is set to ChangeDetectionStrategy.OnPush
      "@angular-eslint/prefer-on-push-component-change-detection": [
        "error"
      ],
      // Disallows using ViewEncapsulation.None
      "@angular-eslint/use-component-view-encapsulation": [
        "error"
      ],
      // Ensures ASC alphabetical order for NgModule metadata arrays for easy visual scanning
      // DEPRECATED
      // "@angular-eslint/sort-ngmodule-metadata-arrays": "error",
      // Ensures that classes implement lifecycle interfaces corresponding to the declared lifecycle methods
      // https://angular.io/guide/styleguide#style-09-01
      "@angular-eslint/use-lifecycle-interface": [
        "error"
      ],
      // Ensures that input bindings, including aliases, are not named or prefixed by the configured disallowed prefixes
      "@angular-eslint/no-input-prefix": [
        "error",
        {
          "prefixes": [
            "on"
          ]
        }
      ],
      // Classes decorated with @Component must have defined suffix in their name
      "@angular-eslint/component-class-suffix": [
        "error",
        {
          "suffixes": [
            "Component",
            "View",
            "Controller",
            "Page"
          ]
        }
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          "type": "element",
          "prefix": "neko",
          "style": "kebab-case"
        }
      ],
      // DEPRECATED
      // "@angular-eslint/no-host-metadata-property": [
      //   "error",
      //   {
      //   "allowStatic": true
      // }
      // ]
    }
  },
  {
    files: ['**/*.html'],
    extends: [
      eslintPluginPrettierRecommended,
      ...angular.configs.templateRecommended,
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Disallows the use of inline styles in HTML templates
      "@angular-eslint/template/no-inline-styles": [
        "error",
        {
          "allowBindToStyle": true
        }
      ],
      // Ensures that HTML attributes and Angular bindings are sorted based on an expected order
      "@angular-eslint/template/attributes-order": [
        "error",
        {
          "alphabetical": true,
          "order": [
            "STRUCTURAL_DIRECTIVE",
            "TEMPLATE_REFERENCE",
            "INPUT_BINDING",
            "TWO_WAY_BINDING",
            "ATTRIBUTE_BINDING",
            "OUTPUT_BINDING"
          ]
        }
      ]
    }
  }
);
