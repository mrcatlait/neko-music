<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './button.svelte';
  import { fn } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'Atoms/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: { type: 'select' },
        options: ['filled', 'outlined', 'text'],
      },
      color: {
        control: { type: 'select' },
        options: ['primary', 'secondary'],
      },
    },
    args: {
      onclick: fn(),
    }
  });
</script>

<Story name="Filled" args={{ variant: 'filled', color: 'primary' }}>
  Button
</Story>

<Story name="Outlined" args={{ variant: 'outlined', color: 'primary' }}>
  Button
</Story>

<Story name="Text" args={{ variant: 'text', color: 'primary' }}>
  Button
</Story>
