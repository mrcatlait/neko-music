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
  ]
}))
