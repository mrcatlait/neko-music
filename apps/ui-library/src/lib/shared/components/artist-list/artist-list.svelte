<script lang="ts">
  import type { AlbumArtist, TrackArtist } from '@/shared/models'
  import { getUiState } from '@/shared/contexts'

  interface Props {
    artists: AlbumArtist[] | TrackArtist[]
  }

  let { artists }: Props = $props()

  const { touchDevice } = getUiState()
</script>

<span aria-label="Artists">
  {#if touchDevice}
    {#each artists as artist, index (artist.id)}
      <span>{artist.name}</span>{#if index < artists.length - 1}<span aria-hidden="true">,&nbsp;</span>{/if}
    {/each}
  {:else}
    {#each artists as artist, index (artist.id)}
      <a
        href={`/artists/${artist.id}`}
        class="artist-list__link"
        title={artist.name}
      >
        {artist.name}
      </a>{#if index < artists.length - 1}<span aria-hidden="true">,&nbsp;</span>{/if}
    {/each}
  {/if}
</span>

<style lang="scss">
  .artist-list {
    &__link:hover {
      text-decoration: underline;
    }
  }
</style>
