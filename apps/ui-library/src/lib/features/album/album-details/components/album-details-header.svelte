<script lang="ts">
  import { getArtworkUrl } from '@/shared/utils'
  import type { Album } from '@/shared/models'
  import { ArtistList } from '@/shared/components'

  type Props = {
    album: Album
  }

  const { album }: Props = $props()
</script>

<header class="album-details-header">
  <img
    class="album-details-header__artwork"
    src={getArtworkUrl(album.artwork.url, 'large')}
    alt=""
    width={256}
    height={256}
  />

  <div class="album-details-header__info">
    <h2 class="album-details-header__info-title">{album.title}</h2>
    <h3 class="display-small album-details-header__info-artists">
      <ArtistList artists={album.artists} />
    </h3>
    <span class="album-details-header__info-meta label-large">{album.genres.join(', ')} • {album.releaseDate}</span>
  </div>
</header>

<style lang="scss">
  .album-details-header {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas:
      'artwork info'
      'artwork info';
    gap: 48px;
    // background-color: var(--n-album-details-header-bg);

    &__artwork {
      width: 256px;
      height: 256px;
      object-fit: cover;
      border-radius: var(--shape-corner-large);
      grid-area: artwork;
    }

    &__info {
      grid-area: info;
      display: flex;
      flex-direction: column;
      // justify-content: center;
      margin-top: 62px;

      &-title {
        color: var(--n-album-details-header-bg);
      }

      &-artists {
        color: var(--color-primary);
      }

      &-meta {
        margin-top: 10px;
        color: var(--color-text-medium-emphasis);
      }
    }
  }
</style>
