<script lang="ts" module>
  import { createContext } from '../../../shared/hooks';
	import { PlayerState } from '../states';

  const { get, set } = createContext<PlayerState>();

  export { get as getPlayerState };
</script>

<script lang="ts">
  const { children } = $props();

  set(new PlayerState());
</script>

{@render children?.()}
