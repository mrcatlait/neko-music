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
</style>
