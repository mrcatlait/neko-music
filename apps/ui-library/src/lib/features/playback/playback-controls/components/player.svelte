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
    <div class="player-section track-section">
      <TrackInfo />
    </div>

    <div class="player-section controls-section">
      <PlayerControls />
      <ProgressBar />
    </div>

    <div class="player-section actions-section">
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

    @include ds.window-class(compact) {
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
    align-items: center;
    grid-template-columns: minmax(200px, 1fr) minmax(400px, 2fr) minmax(200px, 1fr);
    inset: auto 0 0;
    padding: 0 var(--spacing-layout);
    height: var(--n-player-height);
    background: var(--n-player-background);
    gap: 24px;

    @include ds.elevation(2);

    @include ds.window-class(compact) {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      bottom: calc(var(--n-navigation-height) + var(--spacing-layout));
      left: var(--spacing-layout);
      right: var(--spacing-layout);
      gap: 12px;
      border-radius: var(--shape-corner-large);
      height: auto;
      padding: 16px;
    }
  }

  .player-section {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .track-section {
    justify-content: flex-start;
  }

  .controls-section {
    flex-direction: column;
    justify-content: center;
    gap: 8px;

    @include ds.window-class(compact) {
      order: 1;
    }
  }

  .actions-section {
    justify-content: flex-end;

    @include ds.window-class(compact) {
      order: 3;
      justify-content: center;
    }
  }

  @include ds.window-class(compact) {
    .track-section {
      order: 2;
      justify-content: center;
    }
  }
</style>
