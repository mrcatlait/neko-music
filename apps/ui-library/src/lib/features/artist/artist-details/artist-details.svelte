<script lang="ts">
  import type { Artist } from '@/shared/models'
  import { ArtistDetailsHeader } from './components'

  interface Props {
    artist: Artist
  }

  const { artist }: Props = $props()
</script>

<section class="artist-details">
  <ArtistDetailsHeader {artist} />
</section>

<style lang="scss">
  .artist-details {
    display: flex;
    flex-direction: column;
    margin: 32px 0;
  }
</style>
