<script lang="ts" module>
  import { createContext } from '$lib/shared/hooks/create-context.hook';
	import { PlaybackState } from '../states/playback.state.svelte';

  const { get, set } = createContext<PlaybackState>();

  export { get as getPlaybackState };
</script>

<script lang="ts">
  const { children } = $props();

  set(new PlaybackState());
</script>

{@render children?.()}
