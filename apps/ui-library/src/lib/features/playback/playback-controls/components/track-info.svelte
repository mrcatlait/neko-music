<script lang="ts">
  import { getArtworkUrl } from '@/shared/utils'
  import { getPlaybackState } from '@/shared/contexts'
  import { ArtistList } from '@/shared/components'

  const state = getPlaybackState()

  const track = $derived(state.queue.currentTrack)
</script>

{#if track}
  <div class="track-info">
    <div class="track-info__artwork">
      <img
        src={getArtworkUrl(track.artwork.url, 'small')}
        alt=""
        height="56"
        width="56"
      />
    </div>

    <div class="track-info__title truncate">
      <h3
        class="body-large truncate"
        title={track.title}
      >
        {track.title}
      </h3>

      <div class="track-info__artists truncate body-medium">
        <ArtistList artists={track.artists} />
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../../styles/abstracts' as abstracts;

  .track-info {
    --n-track-info-size: 56px;

    display: flex;
    align-items: center;
    height: var(--n-track-info-size);
    overflow: hidden;

    @include abstracts.window-class(compact) {
      --n-track-info-size: 40px;
    }

    &__artwork {
      img {
        width: var(--n-track-info-size);
        height: var(--n-track-info-size);
        border-radius: var(--shape-corner-small);
        object-fit: cover;
        flex-shrink: 0;
        margin-right: 16px;
      }
    }

    &__artists {
      color: var(--color-text-medium-emphasis);
    }
  }

  .track-info__artwork {
    width: var(--n-track-info-size);
    height: var(--n-track-info-size);
    border-radius: var(--shape-corner-small);
    object-fit: cover;
    flex-shrink: 0;
    margin-right: 16px;
  }
</style>
