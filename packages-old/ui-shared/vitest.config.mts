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
    setupFiles: ['src/test-setup.ts'],
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './reports/unit/junit-report.xml',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        '**/index.ts',
        '**/*.model.ts',
        '**/*.spec.ts'
      ],
      reporter: ['text', 'lcov'],
    },
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}))
