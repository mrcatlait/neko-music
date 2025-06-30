<script lang="ts">
  import { ArtistDetails } from '@/features/artist/artist-details'
  import type { PageProps } from './$types'
  import { TrackList } from '@/shared/components/track-list'
  import type { Queue } from '@/shared/models'
  import { QUEUE_TYPES } from '@/shared/enums'

  const { data }: PageProps = $props()

  const queue: Queue = {
    id: data.artist.id,
    name: data.artist.name,
    type: QUEUE_TYPES.Album,
    tracks: data.tracks,
  }
</script>

<ArtistDetails artist={data.artist} />

<!-- <AlbumByArtist albums={data.albums} /> -->

<TrackList {queue} />

<style lang="scss">
  .artist-albums {
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin: 0;
      padding: 0;
    }

    &__item {
      list-style: none;
    }
  }
</style>
