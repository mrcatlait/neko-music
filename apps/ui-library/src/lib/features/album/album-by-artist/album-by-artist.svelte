<script lang="ts">
  import type { Album } from '@/shared/models'
  import { AlbumCard } from '../album-shared/components'

  interface Props {
    albums: Album[]
  }

  const { albums }: Props = $props()
</script>

<section class="album-by-artist">
  <h3>Albums</h3>

  <ol
    class="album-new-releases__list"
    role="list"
  >
    {#each albums as album (album.id)}
      <li class="album-new-releases__item">
        <AlbumCard
          {album}
          variant="discography"
        />
      </li>
    {/each}
  </ol>
</section>

<style lang="scss">
</style>
