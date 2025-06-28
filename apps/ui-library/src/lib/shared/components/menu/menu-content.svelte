<script lang="ts">
  import { DropdownMenu } from 'bits-ui'

  let {
    ref = $bindable(null),
    sideOffset = 4,
    portalProps,
    ...restProps
  }: DropdownMenu.ContentProps & {
    portalProps?: DropdownMenu.PortalProps
  } = $props()
</script>

<DropdownMenu.Portal {...portalProps}>
  <DropdownMenu.Content
    bind:ref
    data-slot="dropdown-menu-content"
    {sideOffset}
    {...restProps}
  />
</DropdownMenu.Portal>
