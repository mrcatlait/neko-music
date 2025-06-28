<script lang="ts">
  import { ArtistList } from '@/shared/components'
  import { getUiState } from '@/shared/contexts'
  import type { Album } from '@/shared/models'
  import { getArtworkUrl } from '@/shared/utils'

  interface Props {
    album: Album
    variant?: 'default' | 'discography'
  }

  let { album, variant = 'default' }: Props = $props()

  const { touchDevice } = getUiState()
</script>

<article
  class="album-card"
  aria-label="Album"
>
  <picture>
    <source
      srcset={getArtworkUrl(album.artwork.url, 'medium')}
      type="image/webp"
    />
    <img
      alt=""
      loading="lazy"
      src="/assets/1x1.gif"
      role="presentation"
      decoding="async"
      class="album-card__artwork"
      width="256"
      height="256"
    />
  </picture>

  <h3 class="album-card__headline title-medium truncate">
    {#if touchDevice}
      {album.title}
    {:else}
      <a
        href={`/albums/${album.id}`}
        class="album-card__album-link"
        title={album.title}
      >
        {album.title}
      </a>
    {/if}
  </h3>

  {#if variant === 'discography'}
    <time
      class="album-card__supporting-text body-medium"
      datetime={album.releaseDate}
    >
      {album.releaseDate}
    </time>
  {:else}
    <p class="album-card__supporting-text body-medium truncate">
      {#if !touchDevice}
        <span aria-label="Album type">{album.type}</span>
        <span aria-hidden="true">•</span>
      {/if}

      <ArtistList artists={album.artists} />
    </p>
  {/if}
</article>

<style lang="scss">
  .album-card {
    display: flex;
    flex-direction: column;

    &__artwork {
      width: 100%;
      margin-bottom: 8px;
      height: auto;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      border-radius: var(--shape-corner-large);
    }

    &__headline {
      color: var(--color-text-high-emphasis);
    }

    &__album-link:hover {
      text-decoration: underline;
    }

    &__supporting-text {
      color: var(--color-text-medium-emphasis);
    }
  }
</style>
