<script lang="ts">
  import type { Track } from '@/shared/models'
  import { formatDuration, getArtworkUrl } from '@/shared/utils'
  import { ArtistList } from '../artist-list'
  import { IconButton } from '../icon-button'
  import { getPlaybackState } from '@/shared/contexts'
  import { trackListSelectors } from '@neko/selectors'

  interface Props {
    track: Track
    onTogglePlay: (trackId: string) => void
  }

  const { track, onTogglePlay }: Props = $props()

  const playbackState = getPlaybackState()

  const duration = formatDuration(track.duration)
  const isSelected = $derived(playbackState.currentTrack?.id === track.id)
</script>

<div
  class="track-list-item"
  role="row"
  tabindex="0"
  aria-selected={isSelected}
  data-testid={trackListSelectors.trackListItem}
>
  <picture>
    <source
      srcset={getArtworkUrl(track.artwork.url, 'small')}
      type="image/webp"
    />
    <img
      alt=""
      loading="lazy"
      src="/assets/1x1.gif"
      role="presentation"
      decoding="async"
      class="track-list-item__artwork"
      width="40"
      height="40"
      data-testid={trackListSelectors.trackListItemImage}
    />
  </picture>

  <div class="track-list-item__title title-medium truncate">
    <button
      class="truncate"
      onclick={() => onTogglePlay(track.id)}
      title={track.title}
      data-testid={trackListSelectors.trackListItemTitle}
    >
      {track.title}
    </button>

    {#if track.explicit}
      <i
        data-size="small"
        aria-label="Contains explicit content"
        title="Contains explicit content"
        data-testid={trackListSelectors.trackListItemExplicitIcon}
      >
        explicit
      </i>
    {/if}
  </div>

  <div
    class="track-list-item__artists body-small truncate"
    role="list"
    data-testid={trackListSelectors.trackListItemArtistsText}
  >
    <ArtistList artists={track.artists} />
  </div>

  <div class="track-list-item__album body-small truncate">
    <a
      href={`/albums/${track.album.id}`}
      class="track-list-item__album-link"
      title={track.album.name}
      data-testid={trackListSelectors.trackListItemAlbumTitle}
    >
      {track.album.name}
    </a>
  </div>

  <div class="track-list-item__duration label-large">
    <time
      datetime={duration}
      data-testid={trackListSelectors.trackListItemDurationText}
    >
      {duration}
    </time>
  </div>

  <div class="track-list-item__actions">
    <IconButton>
      <i>more_vert</i>
    </IconButton>
  </div>
</div>

<style lang="scss">
  @use '../../../styles/abstracts' as abstracts;

  .track-list-item {
    display: grid;
    width: 100%;
    grid-template-columns: 40px 2fr 1fr 1fr 64px 40px;
    align-items: center;
    gap: 16px;
    padding: 8px 16px;

    &:not(:first-child) {
      border-top: 1px solid var(--color-outline);
    }

    &[aria-selected='true'] {
      background-color: var(--color-surface-container-high);
      border-color: transparent;

      &:hover {
        background-color: var(--color-surface-container-high);
      }
    }

    &:hover {
      background-color: var(--color-surface-container);

      &__artwork {
        opacity: 0.8;
      }
    }

    a:hover {
      text-decoration: underline;
    }

    &__artwork {
      border-radius: var(--shape-corner-small);
    }

    &__title {
      display: flex;
      align-items: center;
      gap: 4px;

      button {
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
      }

      i {
        cursor: default;
        color: var(--color-text-medium-emphasis);
      }
    }

    &__artists {
      color: var(--color-text-medium-emphasis);
    }

    &__album {
      color: var(--color-text-medium-emphasis);
    }

    &__album-link {
    }

    &__duration {
      color: var(--color-text-medium-emphasis);
      text-align: right;
    }

    &__actions {
    }
  }
</style>
