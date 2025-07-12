<script lang="ts">
  import { getPlaybackState } from '@/shared/contexts'
  import { Slider } from '@/shared/components'
  import { formatDuration } from '@/shared/utils'

  const playbackState = getPlaybackState()

  let currentTime = $derived(playbackState.currentTime)
  let duration = $derived(playbackState.currentDuration)

  function handleValueChange(value: number) {
    playbackState.seek(value)
  }
</script>

<div
  class="progress-bar"
  role="group"
  aria-label="Progress"
>
  <div class="progress-bar__time">
    <span aria-label="Current time">{formatDuration(currentTime)}</span>
  </div>

  <div class="progress-bar__slider">
    <Slider
      bind:value={currentTime}
      type="single"
      min={0}
      max={duration}
      step={0.1}
      hideThumb
      onValueCommit={handleValueChange}
      aria-label="Seek to position in track"
    />
  </div>

  <div class="progress-bar__time">
    <span aria-label="Total duration">{formatDuration(duration)}</span>
  </div>
</div>

<style lang="scss">
  .progress-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-width: 0;

    &__time {
      font-size: 12px;
      font-weight: 400;
      color: var(--color-on-surface-variant);
      white-space: nowrap;
      user-select: none;
    }

    &__slider {
      flex: 1;
    }
  }
</style>
