import { defineConfig } from 'vite';
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
    reporters: ['default', 'junit'],
    include: ['src/**/*.spec.ts'],
    outputFile: {
      junit: './reports/unit/junit-report.xml',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'main.ts',
        'src/migrations/*',
        '**/*.d.ts',
        '**/index.ts',
        '**/*.model.ts',
        '**/*.dto.ts',
        '**/*.entity.ts',
        '**/*.module.ts',
        '**/*.table.ts',
        '**/*.spec.ts',
      ],
      reporter: ['text', 'lcov'],
      all: true,
    }
  },
}))
