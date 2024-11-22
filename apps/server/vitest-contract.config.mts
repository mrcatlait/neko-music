/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => ({
  plugins: [
    viteTsConfigPaths({
      root: './',
    }),
  ],
  test: {
    globals: true,
    watch: false,
    hookTimeout: 30000,
    include: ['contract-tests/**/*.spec.ts'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './reports/contract/junit-report.xml',
    },
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}))
