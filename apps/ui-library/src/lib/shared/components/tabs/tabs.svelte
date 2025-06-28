<script lang="ts">
  import { Tabs } from 'bits-ui'

  type Variant = 'primary' | 'secondary'

  interface Props extends Tabs.RootProps {
    variant?: Variant
  }

  let { ref = $bindable(null), variant = 'primary', ...restProps }: Props = $props()
</script>

<Tabs.Root
  bind:ref
  data-slot="tabs"
  data-tabs-variant={variant}
  {...restProps}
/>
