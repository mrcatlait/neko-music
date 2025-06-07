<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import PlayerControls from './player-controls.svelte'
  import { PlayerContext } from '../contexts'
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
  <PlayerContext>
    <div class="player-content">
      <TrackInfo />
      <PlayerControls />
      <div class="player-actions">
        <VolumeControl />
      </div>
    </div>
  </PlayerContext>
</div>

<style lang="scss">
  @use '../../../styles/abstracts' as ds;

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
    grid-template-columns: 1fr auto 1fr;
    inset: auto 0 0;
    padding: 0 var(--spacing-layout);
    height: var(--n-player-height);
    background: var(--n-player-background);

    @include ds.elevation(2);

    @include ds.window-class(compact) {
      grid-template-columns: 1fr auto;
      bottom: calc(var(--n-navigation-height) + var(--spacing-layout));
      left: var(--spacing-layout);
      right: var(--spacing-layout);
      gap: 28px;
      border-radius: var(--shape-corner-large);
    }
  }
</style>
