<script lang="ts">
  import { PLAYBACK_STATUS, REPEAT_OPTIONS } from '@/shared/enums'
  import { getPlaybackState } from '@/shared/contexts'

  const state = getPlaybackState()

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault()
      state.play()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      state.seek(state.currentTime + 10)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      state.seek(state.currentTime - 10)
    }
  }

  function handlePlayPause() {
    if (state.status === PLAYBACK_STATUS.Playing) {
      state.pause()
    } else {
      state.play()
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div
  class="player-controls"
  role="group"
  aria-label="Playback Controls"
>
  <button
    class:inactive={!state.shuffle}
    aria-label="Shuffle"
    onclick={state.toggleShuffle}
  >
    <i>shuffle</i>
  </button>

  <button
    aria-label="Previous"
    disabled={!state.hasPrevious}
    onclick={state.previous}
  >
    <i>skip_previous</i>
  </button>

  <button
    class="play-pause-button"
    aria-label={state.status === PLAYBACK_STATUS.Playing ? 'Pause' : 'Play'}
    onclick={handlePlayPause}
  >
    {#if state.status === PLAYBACK_STATUS.Playing}
      <i>pause</i>
    {:else}
      <i>play_arrow</i>
    {/if}
  </button>

  <button
    aria-label="Next"
    disabled={!state.hasNext}
    onclick={state.next}
  >
    <i>skip_next</i>
  </button>

  <button
    aria-label="Repeat"
    onclick={state.toggleRepeat}
  >
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
    align-items: center;
    gap: 8px;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: none;
    background: transparent;
    border-radius: var(--shape-corner-medium, 8px);
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  button:hover:not(:disabled) {
    background-color: var(--color-surface-container);
  }

  button:disabled {
    opacity: var(--state-disabled-layer-opacity, 0.38);
    cursor: not-allowed;
  }

  .play-pause-button {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  .play-pause-button:hover:not(:disabled) {
    background-color: var(--color-primary-container);
    color: var(--color-on-primary-container);
  }

  .inactive {
    opacity: var(--state-disabled-layer-opacity, 0.38);
  }

  i {
    font-family: 'Material Symbols Outlined';
    font-size: 24px;
    line-height: 1;
  }
</style>
