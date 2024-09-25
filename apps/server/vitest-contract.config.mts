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
