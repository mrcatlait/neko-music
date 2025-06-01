<script lang="ts">
  import { getPlayerState } from '../contexts/player.context.svelte';

  const state = getPlayerState();

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      state.play();
    } else if (event.key === 'ArrowRight') {
      state.next();
    } else if (event.key === 'ArrowLeft') {
      state.previous();
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="player-controls">
  <button aria-label="Play" on:click={() => state.play()}>
    <!-- <Icon name="play" /> -->
  </button>
  <button aria-label="Pause" on:click={() => state.pause()}>
    <!-- <Icon name="pause" /> -->
  </button>
  <button aria-label="Next" on:click={() => state.next()}>
    <!-- <Icon name="next" /> -->
  </button>
  <button aria-label="Previous" on:click={() => state.previous()}>
    <!-- <Icon name="previous" /> -->
  </button>
</div>

<style>
  .player-controls {
    display: flex;
    gap: 1rem;
  }
</style>