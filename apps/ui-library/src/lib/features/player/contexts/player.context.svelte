<script
  lang="ts"
  module
>
  import { PlayerState } from '../states'

  import { createContext } from '@/shared/hooks'

  const { get, set } = createContext<PlayerState>()

  export { get as getPlayerState }
</script>

<script lang="ts">
  const { children } = $props()

  set(new PlayerState())
</script>

{@render children?.()}
