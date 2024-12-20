/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => ({
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
    watch: false,
    hookTimeout: 60000,
    setupFiles: ['integration-tests/test-setup.ts'],
    include: ['integration-tests/**/*.spec.ts'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './reports/integration/junit-report.xml',
    },
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}))