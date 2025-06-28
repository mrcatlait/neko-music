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
