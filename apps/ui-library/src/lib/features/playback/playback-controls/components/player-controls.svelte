<script lang="ts">
  import { REPEAT_OPTIONS } from '@/shared/enums'
  import { getPlaybackState } from '@/shared/contexts'

  const state = getPlaybackState()

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      state.play()
    } else if (event.key === 'ArrowRight') {
      state.seek(state.currentTime + 10)
    } else if (event.key === 'ArrowLeft') {
      state.seek(state.currentTime - 10)
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="player-controls">
  <button
    class:inactive={!state.shuffle}
    aria-label="Shuffle"
  >
    <i>shuffle</i>
  </button>

  <button
    aria-label="Previous"
    disabled={!state.hasPrevious}
  >
    <i>skip_previous</i>
  </button>

  <button
    aria-label="Next"
    disabled={!state.hasNext}
  >
    <i>skip_next</i>
  </button>

  <button aria-label="Repeat">
    {#if state.repeat === REPEAT_OPTIONS.None}
      <i class="inactive">repeat</i>
    {:else if state.repeat === REPEAT_OPTIONS.All}
      <i>repeat</i>
    {:else if state.repeat === REPEAT_OPTIONS.Single}
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
