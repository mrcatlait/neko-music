<script lang="ts">
  import type { Track } from '@/shared/models'

  let { track, index, onPlay, onRemove } = $props<{
    track: Track
    index: number
    onPlay: () => void
    onRemove: () => void
  }>()

  let showMenu = $state(false)

  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case ' ':
      case 'Space':
      case 'Enter':
        event.preventDefault()
        onPlay()
        break
      case 'Delete':
      case 'Backspace':
        event.preventDefault()
        onRemove()
        break
    }
  }
</script>

<button
  class="track-item"
  type="button"
  aria-label="Play {track.title} by {track.artists[0]?.name}"
  onclick={onPlay}
  onkeydown={handleKeydown}
>
  <div class="track-item__artwork">
    <img
      src={track.artwork.url}
      alt={`${track.album.name} by ${track.artists[0]?.name}`}
      class="track-item__image"
      loading="lazy"
    />
  </div>

  <div class="track-item__info">
    <h3 class="track-item__title">{track.title}</h3>
    <p class="track-item__artist">{track.artists[0]?.name}</p>
  </div>

  <div class="track-item__actions">
    <div
      class="track-item__remove"
      role="button"
      tabindex="0"
      aria-label="Remove {track.title} from queue"
      onclick={(e) => {
        e.stopPropagation()
        onRemove()
      }}
      onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          onRemove()
        }
      }}
    >
      ✕
    </div>
  </div>
</button>

<style lang="scss">
  .track-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 200ms ease;
    border: none;
    background: transparent;
    text-align: left;
    width: 100%;

    &:hover {
      background: var(--color-surface-container);
    }

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    &__artwork {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
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
      font-size: 1rem;
      font-weight: 500;
      color: var(--color-on-surface);
      margin: 0 0 0.25rem 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__artist {
      font-size: 0.875rem;
      color: var(--color-text-medium-emphasis);
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__actions {
      flex-shrink: 0;
    }

    &__remove {
      background: transparent;
      border: none;
      color: var(--color-text-medium-emphasis);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 200ms ease;

      &:hover {
        background: var(--color-surface-container-high);
        color: var(--color-on-surface);
      }

      &:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
    }
  }
</style>
