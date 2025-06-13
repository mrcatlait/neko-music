<script lang="ts">
  import { blurOnClick } from '@/shared/actions'
  import type { WithElementRef } from 'bits-ui'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type Color = 'primary' | 'secondary'

  type Props = WithElementRef<HTMLButtonAttributes> & {
    color?: Color
  }

  let { children, ref = $bindable(null), color = 'secondary', class: className, ...restProps }: Props = $props()
</script>

<button
  bind:this={ref}
  use:blurOnClick
  data-icon-button-root
  data-icon-button-color={color}
  class={className}
  {...restProps}
>
  {@render children?.()}
</button>

<style lang="scss">
  @use '../../../styles/abstracts' as abstracts;

  :global {
    [data-icon-button-root] {
      --n-icon-button-size: 40px;
      --n-icon-button-shape-corner: var(--shape-corner-full);

      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      background: transparent;
      height: var(--n-icon-button-size);
      min-height: var(--n-icon-button-size);
      width: var(--n-icon-button-size);
      min-width: var(--n-icon-button-size);
      border-radius: var(--n-icon-button-shape-corner);

      &[data-icon-button-color='primary'] {
        --n-icon-button-color: var(--color-primary);
      }

      &[data-icon-button-color='secondary'] {
        --n-icon-button-color: var(--color-secondary);
      }

      color: var(--n-icon-button-color);

      @include abstracts.state(var(--n-icon-button-color));

      &[disabled] {
        cursor: default;

        --n-icon-button-color: rgba(var(--color-on-surface-rgb), 0.38);
      }
    }
  }
</style>
