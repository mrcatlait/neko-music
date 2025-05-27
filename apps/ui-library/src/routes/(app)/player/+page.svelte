<script lang="ts">
  import { goto } from '$app/navigation';
  import { getPlaybackState } from '$lib/features/playback/contexts/playback.context.svelte';

  const state = getPlaybackState();
</script>

<h1>Player</h1>
<p>Current Track Id: {state.currentTrackId}</p>
<button on:click={() => goto('/context')}>Go to Context</button>