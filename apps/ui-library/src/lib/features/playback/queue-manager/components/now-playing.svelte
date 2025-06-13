<script lang="ts">
  import type { Track } from '@/shared/models'

  let { currentTrack } = $props<{
    currentTrack: Track | null
  }>()
</script>

<section
  class="now-playing"
  role="region"
  aria-label="Now Playing"
>
  {#if currentTrack}
    <div class="now-playing__artwork">
      <img
        src={currentTrack.artwork?.url || ''}
        alt={`${currentTrack.album?.name || 'Unknown Album'} by ${currentTrack.artists[0]?.name || 'Unknown Artist'}`}
        class="now-playing__image"
      />
    </div>

    <div class="now-playing__info">
      <h2 class="now-playing__title">{currentTrack.title}</h2>
      <p class="now-playing__artist">{currentTrack.artists[0]?.name}</p>
      <p class="now-playing__album">{currentTrack.album?.name}</p>
    </div>
  {:else}
    <div class="now-playing__empty">
      <p>No track playing</p>
    </div>
  {/if}
</section>

<style lang="scss">
  .now-playing {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--color-surface-container);
    border-radius: 1rem;

    &__artwork {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border-radius: 0.5rem;
      overflow: hidden;
    }

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__info {
      flex: 1;
      min-width: 0;
    }

    &__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-on-surface);
      margin: 0 0 0.25rem 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__artist {
      font-size: 1rem;
      color: var(--color-text-medium-emphasis);
      margin: 0 0 0.125rem 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__album {
      font-size: 0.875rem;
      color: var(--color-text-medium-emphasis);
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 120px;
      color: var(--color-text-medium-emphasis);
    }
  }
</style>
