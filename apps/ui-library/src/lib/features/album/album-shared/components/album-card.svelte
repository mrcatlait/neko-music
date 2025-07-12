<script lang="ts">
  import { ArtistList, IconButton } from '@/shared/components'
  import { getPlaybackState, getUiState } from '@/shared/contexts'
  import type { Album } from '@/shared/entities'
  import { AlbumQueue } from '../models'
  import { getArtworkUrl } from '@/shared/utils'

  interface Props {
    album: Album
    variant?: 'default' | 'discography'
  }

  let { album, variant = 'default' }: Props = $props()

  const { touchDevice } = getUiState()
  const state = getPlaybackState()
</script>

<article
  class="album-card"
  aria-label="Album"
>
  <div class="album-card__artwork-container">
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

    <div class="album-card__play-button">
      <IconButton
        variant="filled"
        onclick={() => state.queue.setQueue(new AlbumQueue({ albumId: album.id }))}
      >
        <i>play_arrow</i>
      </IconButton>
    </div>
  </div>

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

    &__artwork-container {
      position: relative;
      margin-bottom: 8px;
    }

    &__artwork {
      width: 100%;
      height: auto;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      border-radius: var(--shape-corner-large);
    }

    &__play-button {
      position: absolute;
      bottom: 16px;
      right: 16px;
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
