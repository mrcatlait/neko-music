<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import { KeyboardShortcuts, TrackInfo, PlayerControls, ProgressBar, VolumeControl } from './components'
  import { getPlaybackState } from '@/shared/contexts'
  import { PLAYBACK_STATUS } from '@/shared/enums'

  type Props = HTMLAttributes<HTMLDivElement>
  const { ...restProps }: Props = $props()

  const state = getPlaybackState()

  const isEnabled = $derived(state.status !== PLAYBACK_STATUS.None)
</script>

{#if isEnabled}
  <KeyboardShortcuts />

  <div
    class="playback-controls"
    {...restProps}
    aria-label="Player"
    role="region"
  >
    <div class="playback-controls__content">
      <div class="playback-controls__track-info truncate">
        <TrackInfo />
      </div>

      <div class="playback-controls__playback-controls">
        <PlayerControls />
      </div>

      <div class="playback-controls__playback-progress">
        <ProgressBar />
      </div>

      <div class="playback-controls__playback-volume">
        <VolumeControl />
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../styles/abstracts' as abstracts;

  .playback-controls {
    --n-playback-controls-height: 80px;
    --n-navigation-height: 64px;
    --n-playback-controls-background: var(--color-surface-container-high);

    position: relative;
    display: block;
    height: var(--n-playback-controls-height);

    @include abstracts.window-class(compact, medium, expanded) {
      &::before {
        content: '';
      }
    }

    &::before {
      position: fixed;
      height: var(--n-playback-controls-height);
      bottom: var(--n-playback-controls-height);
      left: 0;
      right: 0;
      background: linear-gradient(to bottom, rgba(var(--color-surface-rgb), 0), rgba(var(--color-surface-rgb), 0.9));
      mask: linear-gradient(180deg, rgba(var(--color-surface-rgb), 0), rgba(var(--color-surface-rgb), 1));
      backdrop-filter: blur(5px);

      @include abstracts.window-class(expanded) {
        bottom: 0;
      }
    }

    &__content {
      position: fixed;
      display: grid;
      grid-template-columns: 240px auto 1fr auto;
      grid-template-rows: 1fr;
      grid-template-areas: 'track-info playback-controls playback-progress playback-volume';
      align-items: center;
      column-gap: 48px;
      inset: auto 0 0;
      padding: 0 var(--spacing-layout);
      height: var(--n-playback-controls-height);
      background: var(--n-playback-controls-background);
      overflow: hidden;

      @include abstracts.elevation(2);

      @include abstracts.window-class(expanded) {
        --n-navigation-height: 1px;
      }

      @include abstracts.window-class(compact, medium, expanded) {
        --n-playback-controls-height: 40px;

        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr;
        grid-template-areas: 'track-info playback-controls';
        bottom: calc(var(--n-navigation-height) + var(--spacing-layout));
        left: var(--spacing-layout);
        right: var(--spacing-layout);
        gap: 12px;
        border-radius: var(--shape-corner-large);
        height: auto;
        padding: 8px 12px;
      }
    }

    &__track-info {
      grid-area: track-info;
    }

    &__playback-controls {
      grid-area: playback-controls;
    }

    &__playback-progress {
      grid-area: playback-progress;

      @include abstracts.window-class(compact, medium, expanded) {
        display: none;
      }
    }

    &__playback-volume {
      grid-area: playback-volume;

      @include abstracts.window-class(compact, medium, expanded) {
        display: none;
      }
    }
  }
</style>
