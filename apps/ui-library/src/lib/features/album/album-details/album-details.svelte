<script lang="ts">
  import type { Album, Queue, Track } from '@/shared/models'
  import { AlbumDetailsHeader, AlbumDetailsTrackListItem } from './components'
  import { getPlaybackState } from '@/shared/contexts'
  import { QUEUE_TYPES } from '@/shared/enums'

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
    role="list"
    class="album-details__track-list"
    aria-label="Tracks"
  >
    {#each tracks as track (track.id)}
      <AlbumDetailsTrackListItem
        {track}
        onTogglePlay={handleTogglePlay}
      />
    {/each}
  </div>
</section>

<style lang="scss">
  .album-details {
    display: flex;
    flex-direction: column;
    // padding: 32px 0;
    padding: 32px var(--spacing-layout-medium);
    margin: 0 calc(var(--spacing-layout-medium) * -1);

    // background: linear-gradient(0deg, rgba(0, 0, 0, 0), var(--n-album-details-bg));
    // mask: linear-gradient(180deg, var(--n-album-details-bg), var(--n-album-details-bg));

    &__track-list {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
    }
  }
</style>
