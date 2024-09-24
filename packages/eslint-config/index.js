module.exports = {
  settings: {
    "import/resolver": {
      typescript: true,
      node: true
    }
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended"
  ],
  rules: {
    "semi": ["error", "never"],
    // Enforce a convention in the order of import statements
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        "groups": [
          [
            "builtin",
            "external"
          ],
          [
            "parent",
            "sibling",
            "index"
          ]
        ]
      }
    ],
    // Require explicit accessibility modifiers on class properties and methods
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        "accessibility": "no-public"
      }
    ],
    // Disallow variable declarations from shadowing variables declared in the outer scope.
    "@typescript-eslint/no-shadow": [
      "error"
    ],
    // Remove a specific member delimiter style for interfaces and type literals.
    "@typescript-eslint/member-delimiter-style": "off",
    // Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring
    "@typescript-eslint/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    // Disallow conditionals where the type is always truthy or always falsy
    "@typescript-eslint/no-unnecessary-condition": "warn",
    // Require private members to be marked as readonly if they're never modified outside of the constructor
    "@typescript-eslint/prefer-readonly": "warn",
    // Enforce consistent line breaks after opening and before closing braces
    "object-curly-newline": [
      "error",
      {
        "consistent": true
      }
    ],
    // Enforce camelcase naming convention
    "camelcase": [
      "error",
      {
        "properties": "never"
      }
    ],
    // Enforce consistent brace style for all control statements
    "curly": "error",
    // Require default cases in switch statements
    "default-case": "error",
    // Enforce default clauses in switch statements to be last
    "default-case-last": "error",
    // Disallow else blocks after return statements in if statements
    "no-else-return": "error",
    // Disallow unnecessary return await
    "no-return-await": "error",
    // Disallow shorthand type conversion
    "no-implicit-coercion": "error",

    "@typescript-eslint/no-namespace": "off"
  }
}
