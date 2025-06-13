<script lang="ts">
  import { Tabs } from 'bits-ui'

  let { ref = $bindable(null), ...restProps }: Tabs.ContentProps = $props()
</script>

<Tabs.Content
  bind:ref
  data-slot="tabs-content"
  {...restProps}
/>
