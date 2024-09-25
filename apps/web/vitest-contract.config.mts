import { defineConfig } from 'vite'
import angular from '@analogjs/vite-plugin-angular'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => ({
  plugins: [
    angular(),
    viteTsConfigPaths({
      root: './',
    }),
  ],
  test: {
    globals: true,
    watch: false,
    setupFiles: ['contract-tests/test-setup.ts'],
    environment: 'jsdom',
    include: ['contract-tests/**/*.spec.ts'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './reports/contract/junit-report.xml',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.repository.ts'],
      all: true,
      thresholds: {
        functions: 100,
      },
      reportsDirectory: 'coverage-contract'
    },
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}))
