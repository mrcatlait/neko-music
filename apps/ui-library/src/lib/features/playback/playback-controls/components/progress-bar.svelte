<script lang="ts">
  import { getPlaybackState } from '@/shared/contexts'
  import { Slider } from '@/shared/components'
  import { formatDuration } from '@/shared/utils'

  const playbackState = getPlaybackState()

  function getValue() {
    return playbackState.currentTime
  }

  function setValue(value: number) {
    playbackState.seek(value)
  }

  let currentTime = $derived(playbackState.currentTime)
  let duration = $derived(playbackState.currentTrack?.duration ?? 0)
</script>

<div
  class="progress-section"
  role="group"
  aria-label="Progress"
>
  <div class="time-display">
    <span aria-label="Current time">{formatDuration(currentTime)}</span>
  </div>

  <div class="progress-container">
    <!-- Visual progress bar for display -->
    <div
      class="progress-bar"
      role="progressbar"
      aria-valuenow={currentTime}
      aria-valuemin="0"
      aria-valuemax={duration}
      aria-label="Playback progress"
    >
      <div
        class="progress-fill"
        style:width="{duration > 0 ? (currentTime / duration) * 100 : 0}%"
      ></div>
    </div>

    <!-- Interactive slider for seeking -->
    <div class="seek-slider-container">
      <Slider
        bind:value={getValue, setValue}
        type="single"
        min={0}
        max={duration}
        step={0.1}
        aria-label="Seek to position in track"
      />
    </div>
  </div>

  <div class="time-display">
    <span aria-label="Total duration">{formatDuration(duration)}</span>
  </div>
</div>

<style>
  .progress-section {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-width: 0;
  }

  .time-display {
    font-size: 12px;
    font-weight: 400;
    color: var(--color-on-surface-variant);
    white-space: nowrap;
    user-select: none;
    min-width: 40px;
  }

  .progress-container {
    position: relative;
    flex: 1;
    height: 20px;
    display: flex;
    align-items: center;
  }

  .progress-bar {
    position: absolute;
    width: 100%;
    height: 4px;
    background-color: var(--color-outline-variant);
    border-radius: 2px;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
  }

  .progress-fill {
    height: 100%;
    background-color: var(--color-primary);
    border-radius: 2px;
    transition: width 0.1s ease;
  }

  .seek-slider-container {
    position: relative;
    width: 100%;
    height: 20px;
    z-index: 2;
  }

  :global(.seek-slider) {
    width: 100%;
    height: 20px;
    cursor: pointer;
  }

  :global(.seek-slider [data-slider-range-background]) {
    height: 4px;
    background: transparent;
    border-radius: 2px;
    position: relative;
  }

  :global(.seek-slider [data-slider-range]) {
    height: 4px;
    background: transparent;
    border-radius: 2px;
  }

  :global(.seek-slider [data-slider-thumb]) {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--color-primary);
    border: 2px solid var(--color-surface);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition: opacity 0.2s ease;
    cursor: pointer;
  }

  .progress-container:hover :global(.seek-slider [data-slider-thumb]),
  :global(.seek-slider:focus-within [data-slider-thumb]) {
    opacity: 1;
  }

  .progress-container:hover .progress-bar {
    height: 6px;
  }

  :global(.seek-slider:focus-within) {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
</style>
