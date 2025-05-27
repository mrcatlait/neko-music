<script lang="ts">
  import PlaybackContext from '$lib/features/playback/contexts/playback.context.svelte';
	import Player from '$lib/features/player/components/player.svelte';

  const { children } = $props();
</script>

<PlaybackContext>
	<main>
		{@render children()}

		<Player />
	</main>
</PlaybackContext>
