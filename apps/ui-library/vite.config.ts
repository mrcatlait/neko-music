import { svelteTesting } from '@testing-library/svelte/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    viteTsConfigPaths({
      root: './',
    }),
    visualizer({
      emitFile: true,
      filename: 'stats.html',
    }),
  ],
  server: {
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', '8a72-94-30-154-13.ngrok-free.app'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
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
    benchmark: {
      reporters: ['default'],
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
      {
        extends: './vite.config.ts',
        plugins: [svelteTesting()],
        test: {
          name: 'benchmark',
          environment: 'jsdom',
          include: ['src/**/*.benchmark.{js,ts}'],
          setupFiles: ['./vitest-setup-client.ts'],
        },
      },
    ],
  },
})
