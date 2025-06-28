<script lang="ts">
  import { Tabs } from 'bits-ui'

  type Variant = 'primary' | 'secondary'
  type Density = 'standard' | 'dense'

  type Props = Tabs.ListProps & {
    variant?: Variant
    density?: Density
  }

  let { ref = $bindable(null), variant = 'primary', density = 'standard', ...restProps }: Props = $props()
</script>

<Tabs.List
  bind:ref
  data-slot="tabs-list"
  data-tabs-variant={variant}
  data-tabs-density={density}
  {...restProps}
/>
