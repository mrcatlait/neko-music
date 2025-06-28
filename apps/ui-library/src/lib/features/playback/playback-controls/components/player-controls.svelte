<script lang="ts">
  import { PLAYBACK_STATUS, REPEAT_OPTIONS } from '@/shared/enums'
  import { getPlaybackState } from '@/shared/contexts'
  import { IconButton } from '@/shared/components'

  const state = getPlaybackState()

  function handlePlayPause() {
    if (state.status === PLAYBACK_STATUS.Playing) {
      state.pause()
    } else {
      state.play()
    }
  }
</script>

<div
  class="player-controls"
  role="group"
  aria-label="Playback Controls"
>
  <IconButton
    color="secondary"
    aria-label="Shuffle"
    onclick={() => state.toggleShuffle()}
    class="player-controls__secondary-action"
  >
    <i class:inactive={!state.shuffle}>shuffle</i>
  </IconButton>

  <IconButton
    aria-label="Previous"
    disabled={!state.hasPrevious}
    onclick={() => state.previous()}
    color="secondary"
    class="player-controls__secondary-action"
  >
    <i>skip_previous</i>
  </IconButton>

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

  <IconButton
    aria-label="Next"
    disabled={!state.hasNext}
    onclick={() => state.next()}
    color="secondary"
  >
    <i>skip_next</i>
  </IconButton>

  <IconButton
    aria-label="Repeat"
    onclick={() => state.toggleRepeat()}
    class="player-controls__secondary-action"
  >
    {#if state.repeat === REPEAT_OPTIONS.None}
      <i class:inactive={true}>repeat</i>
    {:else if state.repeat === REPEAT_OPTIONS.All}
      <i>repeat</i>
    {:else if state.repeat === REPEAT_OPTIONS.Single}
      <i>repeat_one</i>
    {/if}
  </IconButton>
</div>

<style lang="scss">
  @use '../../../../styles/abstracts' as abstracts;

  .player-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  :global(.player-controls__secondary-action) {
    @include abstracts.window-class(compact) {
      display: none;
    }
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
    opacity: var(--state-disabled-layer-opacity);
  }
</style>
