/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [
    viteTsConfigPaths({
      root: './',
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    watch: false,
    include: ['src/**/*.spec.ts'],
    exclude: ['src/**/*.pact.spec.ts'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './reports/unit/junit-report.xml',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        '**/app.ts',
        'src/migrations/*',
        'src/seeds/*',
        '**/*.d.ts',
        '**/index.ts',
        '**/*.model.ts',
        '**/*.enum.ts',
        '**/*.dto.ts',
        '**/*.entity.ts',
        '**/*.spec.ts',
      ],
      reporter: ['text', 'lcov'],
      all: true,
    },
  },
  define: {
    'import.meta.vitest': true,
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, './src/common'),
      '@core': path.resolve(__dirname, './src/core'),
      '@features': path.resolve(__dirname, './src/features'),
    },
  },
})
