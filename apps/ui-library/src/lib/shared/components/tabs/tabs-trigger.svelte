<script lang="ts">
  import { Tabs } from 'bits-ui'
  import { blurOnClick } from '../../actions'

  let { ref = $bindable(null), ...restProps }: Tabs.TriggerProps = $props()

  $effect(() => {
    if (ref) {
      const action = blurOnClick(ref)
      return action?.destroy
    }
  })
</script>

<Tabs.Trigger
  bind:ref
  data-slot="tabs-trigger"
  {...restProps}
/>

<style lang="scss">
  @use '../../../styles/abstracts' as abstracts;

  :global {
    [data-tabs-trigger] {
      --n-tabs-trigger-height: 64px;
      --n-tabs-trigger-gap: 8px;
      --n-tabs-trigger-direction: column;
      --n-tabs-trigger-color: var(--color-on-surface);
      --n-tabs-trigger-active-color: var(--color-primary);
      --n-tabs-trigger-indicator-height: 2px;

      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: var(--n-tabs-trigger-direction);
      // background: transparent;
      background: var(--color-surface);
      border: none;
      height: var(--n-tabs-trigger-height);
      gap: var(--n-tabs-trigger-gap);
      cursor: pointer;
      color: var(--n-tabs-trigger-color);

      @include abstracts.typography(title-small);

      @include abstracts.state(var(--n-tabs-trigger-color));

      &[data-state='active'] {
        cursor: default;
        --n-tabs-trigger-color: var(--n-tabs-trigger-active-color);
        box-shadow: 0px calc(var(--n-tabs-trigger-indicator-height) * -1) 0px var(--n-tabs-trigger-color) inset;
      }
    }

    [data-tabs-variant='primary'] {
      [data-tabs-trigger] {
        --n-tabs-trigger-height: 64px;
        --n-tabs-trigger-direction: column;
        --n-tabs-trigger-gap: 0;
        --n-tabs-trigger-indicator-height: 3px;
      }
    }

    [data-tabs-variant='secondary'] {
      [data-tabs-trigger] {
        --n-tabs-trigger-height: 48px;
        --n-tabs-trigger-direction: row;
        --n-tabs-trigger-gap: 8px;
        --n-tabs-trigger-indicator-height: 2px;
      }
    }
  }
</style>
