<script lang="ts">
  import { MenuContent, MenuTrigger } from '@/shared/components'
  import { IconButton } from '@/shared/components'
  import { getPlaybackState } from '@/shared/contexts'
  import type { Track } from '@/shared/entities'
  import { formatDuration, getArtworkUrl } from '@/shared/utils'
  import { playbackQueueSelectors } from '@neko/selectors'
  import { DropdownMenu } from 'bits-ui'

  interface Props {
    tracks: Track[]
  }

  let { tracks }: Props = $props()

  const state = getPlaybackState()
</script>

<ol
  role="list"
  data-testid={playbackQueueSelectors.queueNowPlayingContainer}
>
  {#each tracks as track (track.id)}
    <li data-testid={playbackQueueSelectors.queueNowPlayingTrackItem}>
      <article
        class="track-card truncate"
        class:active={track.id === state.queue.currentTrack?.id}
      >
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
            class="truncate body-large"
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
          <DropdownMenu.Root>
            <MenuTrigger>
              {#snippet child({ props })}
                <IconButton
                  {...props}
                  aria-label="More"
                >
                  <i aria-hidden="true">more_vert</i>
                </IconButton>
              {/snippet}
            </MenuTrigger>
            <MenuContent>
              <ul style="margin: 0; padding: 0;">
                <li>
                  <i>play_arrow</i>
                  <span>Play</span>
                </li>

                <hr />

                <li>
                  <i>add</i>
                  <span>Add to library</span>
                </li>
                <li>
                  <i>playlist_add</i>
                  <span>Add to playlist</span>
                </li>

                <hr />

                <li>
                  <i>queue_play_next</i>
                  <span>Play next</span>
                </li>
                <li>
                  <i>add_to_queue</i>
                  <span>Play last</span>
                </li>
              </ul>
            </MenuContent>
          </DropdownMenu.Root>
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
    border-radius: var(--shape-corner-small);

    @include abstracts.state(var(--color-text-medium-emphasis));

    &.active {
      background-color: var(--color-surface-container-high);
    }
  }

  img {
    border-radius: var(--shape-corner-medium);
    grid-area: image;
  }

  .track-card__content {
    grid-area: content;
  }

  .track-card__artists {
    color: var(--color-text-medium-emphasis);
    @include abstracts.typography(body-medium);
  }

  time {
    grid-area: duration;
    color: var(--color-text-medium-emphasis);
    @include abstracts.typography(label-medium);
  }

  .track-card__actions {
    grid-area: more;
  }
</style>
