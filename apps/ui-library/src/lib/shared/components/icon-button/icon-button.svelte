<script lang="ts">
  import { blurOnClick } from '@/shared/actions'
  import type { WithElementRef } from 'bits-ui'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type Color = 'primary' | 'secondary'

  type Variant = 'filled' | 'text'

  type Props = WithElementRef<HTMLButtonAttributes> & {
    color?: Color
    variant?: Variant
  }

  let { children, ref = $bindable(null), color = 'secondary', variant = 'text', ...restProps }: Props = $props()
</script>

<button
  bind:this={ref}
  use:blurOnClick
  data-icon-button-root
  data-icon-button-color={color}
  data-icon-button-variant={variant}
  {...restProps}
>
  {@render children?.()}
</button>
