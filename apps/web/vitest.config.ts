import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: './',
    globals: true,
    watch: false,
    setupFiles: ['src/test-setup.ts'],
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    exclude: ['src/**/*.pact.spec.ts'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './reports/unit/junit-report.xml',
    },
    coverage: {
      enabled: false,
      excludeAfterRemap: true
    }
  },
  plugins: [
    {
      name: 'angular-coverage-exclude',
      configureVitest(context) {
        context.project.config.coverage.exclude = ['**/*.{test,spec}.?(c|m)ts'];
      }
    }
  ]
});
