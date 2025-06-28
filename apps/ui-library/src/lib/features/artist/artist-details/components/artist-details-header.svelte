<script lang="ts">
  import { getArtworkUrl } from '@/shared/utils'
  import IconButton from '@/shared/components/icon-button/icon-button.svelte'
  import type { Artist } from '@/shared/models'

  type Props = {
    artist: Artist
  }

  const { artist }: Props = $props()
</script>

<header class="artist-details-header">
  <img
    class="artist-details-header__artwork"
    src={getArtworkUrl(artist.artwork.url, 'large')}
    alt=""
    width={256}
    height={256}
  />

  <h1 class="artist-details-header__title">{artist.name}</h1>

  <div class="artist-details-header__actions">
    <IconButton><i>favorite</i></IconButton>
  </div>
</header>

<style lang="scss">
  .artist-details-header {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      'artwork title'
      'artwork actions';
    gap: 16px;

    &__artwork {
      width: 256px;
      height: 256px;
      object-fit: cover;
      border-radius: var(--shape-corner-large);
      grid-area: artwork;
    }

    &__title {
      grid-area: title;
    }

    &__actions {
      display: flex;
      gap: 8px;
      grid-area: actions;
    }
  }
</style>
