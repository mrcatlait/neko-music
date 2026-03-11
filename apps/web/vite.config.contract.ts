import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular'
import viteTsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => ({
  plugins: [
    angular(),
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
    environment: 'jsdom',
    testTimeout: 60000,
    hookTimeout: 60000,
    outputFile: {
      junit: './reports/contract/junit-report.xml',
    }
  },
}))
