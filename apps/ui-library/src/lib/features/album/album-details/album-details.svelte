<script lang="ts">
  import type { Album, Queue, Track } from '@/shared/models'
  import { AlbumDetailsHeader, AlbumDetailsTrackListItem } from './components'
  import { getPlaybackState } from '@/shared/contexts'
  import { QUEUE_TYPES } from '@/shared/enums'
  import { TrackSummary } from '@/shared/components'

  interface Props {
    album: Album
    tracks: Track[]
  }

  const { album, tracks }: Props = $props()

  const queue: Queue = {
    id: album.id,
    name: album.title,
    type: QUEUE_TYPES.Album,
    tracks: tracks,
  }

  const playbackState = getPlaybackState()

  const handleTogglePlay = (trackId: string) => {
    playbackState.togglePlay(queue, trackId)
  }
</script>

<section
  class="album-details"
  style="--n-album-details-bg: {album.artwork.backgroundColor}"
>
  <AlbumDetailsHeader {album} />

  <div
    class="album-details__track-list"
    aria-label="list"
    role="listbox"
  >
    {#each tracks as track (track.id)}
      <AlbumDetailsTrackListItem
        {track}
        onTogglePlay={handleTogglePlay}
      />
    {/each}
  </div>

  <span class="album-details__track-summary body-medium">
    <TrackSummary {tracks} />
  </span>
</section>

<style lang="scss">
  .album-details {
    display: flex;
    flex-direction: column;
    padding: 32px 0;
    gap: 24px;

    &__track-list {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
    }

    &__track-summary {
      color: var(--color-text-medium-emphasis);
    }
  }
</style>
