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
    exclude: ['src/**/*.pact.spec.ts'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './reports/unit/junit-report.xml',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/app/**/*.ts'],
      exclude: [
        '**/index.ts',
        '**/*.dto.ts',
        '**/*.model.ts',
        '**/*.module.ts',
        '**/*.component.ts',
        '**/*.repository.ts',
        '**/*.spec.ts',
      ],
      reporter: ['text', 'lcov'],
    },
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}))
