<script lang="ts">
  import { getPlaybackState } from '@/features/playback/contexts'
  import { REPEAT_OPTIONS } from '@/features/playback/enums'

  const playbackState = getPlaybackState()

  // function handleKeyDown(event: KeyboardEvent) {
  //   if (event.key === ' ') {
  //     state.play();
  //   } else if (event.key === 'ArrowRight') {
  //     state.next();
  //   } else if (event.key === 'ArrowLeft') {
  //     state.previous();
  //   }
  // }
</script>

<!-- <svelte:window on:keydown={handleKeyDown} /> -->

<div class="player-controls">
  <button
    class:inactive={!playbackState.shuffle}
    aria-label="Shuffle"
  >
    <i>shuffle</i>
  </button>

  <button
    aria-label="Previous"
    disabled={!playbackState.hasPrevious}
  >
    <i>skip_previous</i>
  </button>

  <button
    aria-label="Next"
    disabled={!playbackState.hasNext}
  >
    <i>skip_next</i>
  </button>

  <button aria-label="Repeat">
    {#if playbackState.repeat === REPEAT_OPTIONS.None}
      <i class="inactive">repeat</i>
    {:else if playbackState.repeat === REPEAT_OPTIONS.All}
      <i>repeat</i>
    {:else if playbackState.repeat === REPEAT_OPTIONS.Single}
      <i>repeat_one</i>
    {/if}
  </button>
</div>

<style>
  .player-controls {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  .inactive {
    opacity: var(--state-disabled-layer-opacity);
  }
</style>
