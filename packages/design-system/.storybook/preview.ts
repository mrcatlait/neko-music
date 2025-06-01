import type { Preview } from '@storybook/sveltekit'

import { themes } from 'storybook/theming';

import '../src/lib/styles/main.css'
import '../src/lib/styles/typography.css'
import '../src/lib/styles/shapes.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
    },
  },
};

export default preview;