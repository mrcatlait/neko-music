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
    globals: true,
    watch: false,
    reporters: ['default', 'junit'],
    include: ['contract-tests/**/*.spec.ts'],
    setupFiles: ['./contract-tests/test-setup.ts'],
    outputFile: {
      junit: './reports/contract/junit-report.xml',
    }
  },
}))
