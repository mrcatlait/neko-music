import { defineConfig } from 'vitest/config'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
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
    poolOptions: {
      typescript: true,
    }
  },
  define: {
    'import.meta.vitest': true,
  }
})