<script lang="ts">
  import type { Track } from '@/shared/models'
  import { formatDuration, getArtworkUrl } from '@/shared/utils'
  import { getPlaybackState } from '@/shared/contexts'
  import { trackListSelectors } from '@neko/selectors'
  import { ArtistList, IconButton } from '@/shared/components'
  import PlayButton from '@/shared/components/play-button/play-button.svelte'

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
  aria-label={track.title}
  aria-selected={isSelected}
  data-testid={trackListSelectors.trackListItem}
>
  <span class="track-list-item__number title-medium">{track.trackNumber}</span>

  <div class="track-list-item__play-button">
    <PlayButton
      trackId={track.id}
      onclick={() => onTogglePlay(track.id)}
    />
  </div>

  <div class="track-list-item__headline title-medium truncate">
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
    class="track-list-item__supporting-text body-small truncate"
    role="list"
    data-testid={trackListSelectors.trackListItemArtistsText}
  >
    <ArtistList artists={track.artists} />
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
  @use '../../../../styles/abstracts' as abstracts;

  .track-list-item {
    display: grid;
    width: 100%;
    grid-template-columns: 40px 1fr 64px 40px;
    grid-template-rows: 1fr 1fr;
    grid-template-areas:
      'number title duration actions'
      'number artists duration actions';
    align-items: center;
    column-gap: 16px;
    height: 56px;
    padding: 8px 16px 8px 8px;

    &:not(:first-child) {
      border-top: 1px solid var(--color-outline);
    }

    &[aria-selected='true'] {
      background-color: var(--color-surface-container-high);
      border-color: transparent;

      &:hover {
        background-color: var(--color-surface-container-high);
      }

      & > .track-list-item__number {
        display: none;
      }

      & > .track-list-item__play-button {
        display: block;
      }
    }

    &:hover {
      background-color: var(--color-surface-container);

      & > .track-list-item__number {
        display: none;
      }

      & > .track-list-item__play-button {
        display: block;
      }
    }

    &__number {
      grid-area: number;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-medium-emphasis);
    }

    &__play-button {
      grid-area: number;
      display: none;
    }

    &__headline {
      grid-area: title;
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

    &__supporting-text {
      grid-area: artists;
      color: var(--color-text-medium-emphasis);
    }

    &__duration {
      grid-area: duration;
      color: var(--color-text-medium-emphasis);
      text-align: right;
    }

    &__actions {
      grid-area: actions;
    }
  }
</style>
