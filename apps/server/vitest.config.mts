/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
    viteTsConfigPaths({
      root: './',
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    watch: false,
    setupFiles: ['src/test-setup.ts'],
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
        '**/main.ts',
        'src/util/*',
        'src/migrations/*',
        'src/seeds/*',
        'src/modules/database-seed/*',
        '**/*.d.ts',
        '**/index.ts',
        '**/*.model.ts',
        '**/*.enum.ts',
        '**/*.dto.ts',
        '**/*.entity.ts',
        '**/*.module.ts',
        '**/*.table.ts',
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
      '@modules': path.resolve(__dirname, './src/modules'),
    },
  },
})
