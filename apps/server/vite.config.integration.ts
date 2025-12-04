import { defineConfig } from 'vite';
import swc from 'unplugin-swc'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => ({
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
    viteTsConfigPaths({
      root: './',
    }),
  ],
  test: {
    hookTimeout: 60000,
    globals: true,
    watch: false,
    reporters: ['default', 'junit'],
    include: ['integration-tests/**/*.spec.ts'],
    setupFiles: ['./integration-tests/test-setup.ts'],
    testTimeout: 60000,
    outputFile: {
      junit: './reports/integration/junit-report.xml',
    }
  },
}))
