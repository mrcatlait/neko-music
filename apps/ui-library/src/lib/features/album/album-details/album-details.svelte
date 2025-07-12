<script lang="ts">
  import type { Album, Track } from '@/shared/entities'
  import { AlbumDetailsHeader, AlbumDetailsTrackListItem } from './components'
  import { TrackSummary } from '@/shared/components'

  interface Props {
    album: Album
    tracks: Track[]
  }

  const { album, tracks }: Props = $props()
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
        {album}
        {tracks}
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
