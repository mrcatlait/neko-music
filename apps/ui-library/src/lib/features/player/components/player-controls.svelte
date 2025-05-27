<script lang="ts">
  import { getPlayerState } from '$lib/features/player/contexts/player.context.svelte';

  const state = getPlayerState();
</script>

<button on:click={() => state.play()}>Play</button>