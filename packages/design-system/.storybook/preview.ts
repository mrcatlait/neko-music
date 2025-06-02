import type { Preview } from '@storybook/sveltekit'

import { themes } from 'storybook/theming';

import '../src/lib/styles/main.scss'

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