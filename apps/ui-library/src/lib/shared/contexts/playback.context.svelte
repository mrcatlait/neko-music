<script
  lang="ts"
  module
>
  import { createContext } from '../hooks'
  import { PlaybackState } from '../states'

  const { get, set } = createContext<PlaybackState>()

  export { get as getPlaybackState }
</script>

<script lang="ts">
  const { children } = $props()

  set(new PlaybackState())
</script>

{@render children?.()}
