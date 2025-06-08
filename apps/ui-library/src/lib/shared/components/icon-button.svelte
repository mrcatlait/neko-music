<script lang="ts">
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
  data-icon-button-root
  data-icon-button-color={color}
  class={className}
  {...restProps}
>
  {@render children?.()}
</button>
