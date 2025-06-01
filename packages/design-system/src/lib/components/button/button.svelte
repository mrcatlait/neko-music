<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  type Variant = 'outlined' | 'filled' | 'text';

  type Color = 'primary' | 'secondary';

  type Props = {
    children: Snippet;
    click?: () => void;
    disabled?: boolean;
    variant: Variant;
    color: Color;
  } & HTMLButtonAttributes;

  let {click, disabled, children, variant = 'filled', color = 'primary', ...extra}: Props = $props();
</script>

<button
  onclick={click}
  class="{variant} {color}"
  {disabled}
  {...extra}
>
  {@render children()}
</button>


<style>
  button {
    --n-button-size: 40px;
    --n-button-gap: 8px;
    --n-button-shape-corner: var(--shape-corner-full);
    --n-button-padding: 0 16px;
    --n-button-min-width: 72px;

    font-family: var(--typography-font-family);
    font-size: var(--typography-label-large-size);
    line-height: var(--typography-label-large-line-height);
    font-weight: var(--typography-label-large-weight);
    letter-spacing: var(--typography-label-large-tracking);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--n-button-gap);
    border: none;
    cursor: pointer;
    background: transparent;
    block-size: var(--n-button-size);
    border-radius: var(--n-button-shape-corner);
    min-width: var(--n-button-min-width);
    padding: var(--n-button-padding);
  }

  button.filled {
    background: var(--n-button-bg);
    color: var(--n-button-color);
  }

  button.filled.primary {
    --n-button-bg: var(--color-primary);
    --n-button-color: var(--color-on-primary);
  }

  button.filled.secondary {
    --n-button-bg: var(--color-secondary);
    --n-button-color: var(--color-on-secondary);
  }

  button.outlined {
    --n-button-border: var(--color-outline);
    --n-button-color: var(--color-on-surface);

    border: 1px solid var(--n-button-border);
    color: var(--n-button-color);
  }

  button.text {
    --n-button-color: var(--color-on-surface);

    color: var(--n-button-color);
  }
</style>
