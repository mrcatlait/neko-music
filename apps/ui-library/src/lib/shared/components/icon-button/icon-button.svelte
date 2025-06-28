<script lang="ts">
  import { blurOnClick } from '@/shared/actions'
  import type { WithElementRef } from 'bits-ui'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type Color = 'primary' | 'secondary'

  type Props = WithElementRef<HTMLButtonAttributes> & {
    color?: Color
  }

  let { children, ref = $bindable(null), color = 'secondary', ...restProps }: Props = $props()
</script>

<button
  bind:this={ref}
  use:blurOnClick
  data-icon-button-root
  data-icon-button-color={color}
  {...restProps}
>
  {@render children?.()}
</button>
