import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      '@/features/*': './src/lib/features/*',
      '@/shared/*': './src/lib/shared/*',
      '@/styles/*': './src/lib/styles/*',
      '@neko/selectors': '../../packages/selectors/src/index.ts',
      '@neko/selectors/*': '../../packages/selectors/src/*',
    },
  },
}

export default config
