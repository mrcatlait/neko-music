<script
  lang="ts"
  module
>
  import { createContext } from '../hooks'
  import { PlaybackState } from '../states'

  export const PLAYBACK_CONTEXT_KEY = 'playback'

  const { get, set } = createContext<PlaybackState>(PLAYBACK_CONTEXT_KEY)

  export { get as getPlaybackState }
</script>

<script lang="ts">
  const { children } = $props()

  set(new PlaybackState())
</script>

{@render children?.()}
