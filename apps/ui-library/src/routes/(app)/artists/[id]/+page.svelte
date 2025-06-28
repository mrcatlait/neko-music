<script lang="ts">
  import { ArtistDetails } from '@/features/artist/artist-details'
  import type { PageProps } from './$types'
  import { AlbumByArtist } from '@/features/album/album-by-artist'

  const { data }: PageProps = $props()
</script>

<ArtistDetails artist={data.artist} />

<AlbumByArtist albums={data.albums} />

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
