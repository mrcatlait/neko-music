<script lang="ts">
  import { getArtworkUrl } from '@/shared/utils';
  import { getPlaybackState } from '../../playback/contexts';

  const state = getPlaybackState();
  const track = {
    artwork: {
      url: 'https://via.placeholder.com/{size}',
      backgroundColor: '#000000',
      textColor: '#ffffff'
    },
    title: 'Track Title',
    artists: [
      {
        id: '1',
        name: 'Artist Name'
      },
      {
        id: '2',
        name: 'Artist Name 2'
      }
    ]
  }
</script>

<div class="track-info">
  <img src={getArtworkUrl(track.artwork.url, 'small')} alt="" height="56" width="56" />

  <div class="title truncate">
    <p class="title-medium" title={track.title}>
      {track.title}
    </p>

    <div class="truncate">
      {#each track.artists as artist (artist.id)}
        <a href={`/artist/${artist.id}`} class="body-medium truncate secondary-text" title={artist.name}>
          {artist.name}
        </a>
      {/each}
    </div>
  </div>
</div>

<style>
  .track-info {
    --n-track-info-size: 56px;

    display: flex;
    align-items: center;
    height: var(--n-track-info-size);
    overflow: hidden;
  }

  img {
    width: var(--n-track-info-size);
    height: var(--n-track-info-size);
    border-radius: var(--shape-corner-small);
    object-fit: cover;
    flex-shrink: 0;
    margin-right: 16px;
  }

  a {
    width: fit-content;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
