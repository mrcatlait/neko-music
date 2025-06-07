import { svelteTesting } from '@testing-library/svelte/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    viteTsConfigPaths({
      root: './',
    }),
  ],
  test: {
    globals: true,
    watch: false,
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './reports/unit/junit-report.xml',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.ts', 'src/**/*.svelte'],
      exclude: ['**/*.d.ts', '**/index.ts', '**/*.model.ts', '**/*.spec.ts'],
      reporter: ['text', 'lcov'],
      all: true,
    },
    workspace: [
      {
        extends: './vite.config.ts',
        plugins: [svelteTesting()],
        test: {
          name: 'client',
          environment: 'jsdom',
          clearMocks: true,
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**'],
          setupFiles: ['./vitest-setup-client.ts'],
        },
      },
      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}'],
        },
      },
    ],
  },
})
