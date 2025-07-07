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
    class="player-controls__secondary-action"
  >
    <i>skip_previous</i>
  </IconButton>

  <IconButton
    aria-label={state.status === PLAYBACK_STATUS.Playing ? 'Pause' : 'Play'}
    onclick={handlePlayPause}
    variant="filled"
  >
    {#if state.status === PLAYBACK_STATUS.Playing}
      <i>pause</i>
    {:else}
      <i>play_arrow</i>
    {/if}
  </IconButton>

  <IconButton
    aria-label="Next"
    disabled={!state.hasNext}
    onclick={() => state.next()}
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
  .player-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .inactive {
    opacity: var(--state-disabled-layer-opacity);
  }
</style>
