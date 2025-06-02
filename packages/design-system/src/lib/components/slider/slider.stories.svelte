<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Slider from './slider.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Slider',
    component: Slider,
    tags: ['autodocs'],
  });
</script>

<Story name="Horizontal"></Story>
