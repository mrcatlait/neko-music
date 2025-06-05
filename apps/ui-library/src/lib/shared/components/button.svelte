<script lang="ts">
  import type { WithElementRef } from "bits-ui";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Variant = 'outlined' | 'filled' | 'text';

  type Color = 'primary' | 'secondary';

  type Props = WithElementRef<HTMLButtonAttributes> & {
    variant: Variant;
    color: Color;
  };

  let {children, ref = $bindable(null), variant = 'filled', color = 'primary', ...restProps}: Props = $props();
</script>

<button
  bind:this={ref}
  data-button-root
  data-button-variant={variant}
  data-button-color={color}
  {...restProps}
>
  {@render children?.()}
</button>
