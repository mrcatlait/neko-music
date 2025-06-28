<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import clsx from 'clsx'

  type Props = HTMLAttributes<HTMLOListElement>

  const { children, class: className, ...restProps }: Props = $props()
</script>

<ol
  class={clsx('grid-list', className)}
  {...restProps}
>
  {@render children?.()}
</ol>

<style lang="scss">
  .grid-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
    gap: 24px;
  }
</style>
