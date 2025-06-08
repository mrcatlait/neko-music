<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import PlayerControls from './player-controls.svelte'
  import ProgressBar from './progress-bar.svelte'
  import TrackInfo from './track-info.svelte'
  import VolumeControl from './volume-control.svelte'

  type Props = HTMLAttributes<HTMLDivElement>
  const { ...restProps }: Props = $props()
</script>

<div
  class="player"
  {...restProps}
  aria-label="Player"
  role="region"
>
  <div class="player-content">
    <div class="player-content-track-info">
      <TrackInfo />
    </div>

    <div class="player-content-playback-controls">
      <PlayerControls />
    </div>

    <div class="player-content-playback-progress">
      <ProgressBar />
    </div>

    <div class="player-content-playback-volume">
      <VolumeControl />
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../../styles/abstracts' as ds;

  .player {
    --n-player-height: 80px;
    --n-navigation-height: 64px;
    --n-player-background: var(--color-surface-container-high);

    position: relative;
    display: block;
    height: var(--n-player-height);

    @include ds.window-class(compact, medium) {
      &::before {
        content: '';
      }
    }

    &::before {
      position: fixed;
      height: var(--n-player-height);
      bottom: var(--n-player-height);
      left: 0;
      right: 0;
      background: linear-gradient(to bottom, rgba(var(--color-surface-rgb), 0), rgba(var(--color-surface-rgb), 0.9));
      mask: linear-gradient(180deg, rgba(var(--color-surface-rgb), 0), rgba(var(--color-surface-rgb), 1));
      backdrop-filter: blur(5px);
    }
  }

  .player-content {
    position: fixed;
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    grid-template-rows: 1fr;
    grid-template-areas: 'track-info playback-controls playback-progress playback-volume';
    align-items: center;
    column-gap: 48px;
    inset: auto 0 0;
    padding: 0 var(--spacing-layout);
    height: var(--n-player-height);
    background: var(--n-player-background);

    @include ds.elevation(2);

    @include ds.window-class(compact, medium) {
      grid-template-columns: 1fr auto;
      grid-template-rows: 1fr;
      grid-template-areas: 'track-info playback-controls';
      bottom: calc(var(--n-navigation-height) + var(--spacing-layout));
      left: var(--spacing-layout);
      right: var(--spacing-layout);
      gap: 12px;
      border-radius: var(--shape-corner-large);
      height: auto;
      padding: 16px;
    }
  }

  .player-content-track-info {
    grid-area: track-info;
  }

  .player-content-playback-controls {
    grid-area: playback-controls;
  }

  .player-content-playback-progress {
    grid-area: playback-progress;

    @include ds.window-class(compact, medium) {
      display: none;
    }
  }

  .player-content-playback-volume {
    grid-area: playback-volume;

    @include ds.window-class(compact, medium) {
      display: none;
    }
  }
</style>
