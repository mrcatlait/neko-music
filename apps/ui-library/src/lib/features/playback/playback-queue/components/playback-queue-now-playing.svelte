<script lang="ts">
  import IconButton from '@/shared/components/icon-button/icon-button.svelte'
  import type { Track } from '@/shared/models'
  import { formatDuration, getArtworkUrl } from '@/shared/utils'
  import { playbackQueueSelectors } from '@neko/selectors'

  interface Props {
    tracks: Track[]
  }

  let { tracks }: Props = $props()
</script>

<ol
  role="list"
  data-testid={playbackQueueSelectors.queueNowPlayingContainer}
>
  {#each tracks as track (track.id)}
    <li data-testid={playbackQueueSelectors.queueNowPlayingTrackItem}>
      <article class="track-card truncate">
        <img
          src={getArtworkUrl(track.artwork.url, 'small')}
          alt=""
          class="now-playing__image"
          width="56"
          height="56"
          loading="lazy"
          decoding="async"
        />

        <div class="track-card__content truncate">
          <h3
            title={track.title}
            class="truncate"
          >
            {track.title}
          </h3>

          <div
            aria-label="Artists"
            class="track-card__artists truncate"
            title={track.artists.map((artist) => artist.name).join(', ')}
          >
            {track.artists.map((artist) => artist.name).join(', ')}
          </div>
        </div>

        <time
          datetime="PT{track.duration}S"
          aria-label="Duration"
        >
          {formatDuration(track.duration)}
        </time>

        <div class="track-card__actions">
          <IconButton
            class=""
            aria-label="More"
          >
            <i aria-hidden="true">more_vert</i>
          </IconButton>
        </div>
      </article>
    </li>
  {/each}
</ol>

<style lang="scss">
  @use '../../../../styles/abstracts' as abstracts;

  ol {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 24px 0;
  }

  li {
    list-style: none;
  }

  .track-card {
    display: grid;
    align-items: center;
    padding: 8px;
    gap: 16px;
    background-color: var(--color-surface);
    grid-template-columns: 56px 1fr 56px 40px;
    grid-template-rows: 1fr;
    grid-template-areas: 'image content duration more';

    &:hover {
      background-color: var(--color-surface-container);
    }
  }

  img {
    border-radius: var(--shape-corner-medium);
    grid-area: image;
  }

  .track-card__content {
    grid-area: content;
  }

  h3 {
    @include abstracts.typography(title-medium);
  }

  .track-card__artists {
    color: var(--color-text-medium-emphasis);
    @include abstracts.typography(title-small);
  }

  time {
    grid-area: duration;
    color: var(--color-text-medium-emphasis);
    @include abstracts.typography(title-small);
  }

  .track-card__actions {
    grid-area: more;
  }
</style>
