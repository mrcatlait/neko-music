<script lang="ts" module>
  import { createContext } from '$lib/utils/context';
	import { PlayerState } from '../states/player.state.svelte';

  const { get, set } = createContext<PlayerState>();

  export { get as getPlayerState };
</script>

<script lang="ts">
  const { children } = $props();

  set(new PlayerState());
</script>

{@render children?.()}
