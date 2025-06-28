<script lang="ts">
  import type { Album } from '@/shared/models'
  import { AlbumCard } from '../album-shared/components'

  interface Props {
    albums: Album[]
  }

  let { albums }: Props = $props()
</script>

<section class="album-new-releases">
  <h2>New Releases</h2>

  <ol
    class="album-new-releases__list"
    role="list"
  >
    {#each albums as album (album.id)}
      <li class="album-new-releases__item">
        <AlbumCard {album} />
      </li>
    {/each}
  </ol>
</section>

<style lang="scss">
  @use '../../../styles/abstracts' as abstracts;

  .album-new-releases {
    --n-album-new-releases-column-gap: 20px;
    --n-album-new-releases-row-gap: 24px;
    --n-album-new-releases-grid-columns: 6;
    --n-album-new-releases-grid-rows: 2;

    display: flex;
    flex-direction: column;
    margin: 64px 0;
    overflow: visible;

    &__list {
      display: grid;
      overflow: hidden;
      justify-content: space-between;
      grid-auto-columns: var(
        --n-album-new-releases-grid-column-min-width,
        calc(
          (100% - (var(--n-album-new-releases-grid-columns) - 1) * var(--n-album-new-releases-column-gap)) /
            var(--n-album-new-releases-grid-columns)
        )
      );
      grid-template-rows: repeat(var(--n-album-new-releases-grid-rows), max-content);
      column-gap: var(--n-album-new-releases-column-gap);
      row-gap: var(--n-album-new-releases-row-gap);
      grid-auto-flow: column;
      width: 100%;
      margin: 0;
      margin-top: 28px;
      padding: 0;

      @include abstracts.window-class(compact) {
        --n-album-new-releases-grid-column-min-width: 144px;
        --n-album-new-releases-grid-columns: 12;
        --n-album-new-releases-grid-rows: 1;
        --n-album-new-releases-column-gap: 12px;
        --n-album-new-releases-row-gap: 16px;

        scroll-behavior: smooth;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        overflow-x: auto;
        overflow-y: hidden;
      }

      @include abstracts.window-class(medium) {
        --n-album-new-releases-grid-columns: 4;
      }

      @include abstracts.window-class(expanded) {
        --n-album-new-releases-grid-columns: 5;
      }

      @include abstracts.window-class(large) {
        --n-album-new-releases-grid-columns: 5;
      }

      @include abstracts.window-class(extra-large) {
        --n-album-new-releases-grid-columns: 6;
        --n-album-new-releases-grid-rows: 2;
      }
    }

    &__item {
      list-style: none;
      margin: 0;
      padding: 0;
      min-width: 0;
    }
  }
</style>
