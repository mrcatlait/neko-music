<script lang="ts">
  import PlayerControls from './player-controls.svelte';
  import PlayerContext from '../contexts/player.context.svelte';
</script>

<PlayerContext>
  <PlayerControls />
</PlayerContext>
