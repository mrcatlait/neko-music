<script lang="ts">
  import type { Track } from '@/shared/entities'
  import TrackListItem from './track-list-item.svelte'
  import { GenericQueue } from '@/shared/models'
  import { getPlaybackState } from '@/shared/contexts'

  interface Props {
    tracks: Track[]
    name: string
    description?: string
  }

  const { tracks, name, description }: Props = $props()

  const playbackState = getPlaybackState()

  const handleTogglePlay = (trackId: string) => {
    playbackState.togglePlay(
      trackId,
      (id) =>
        new GenericQueue({
          tracks,
          metadata: {
            name,
            description: description || `${tracks.length} tracks`,
            type: 'playlist',
          },
          startFromTrack: id,
        }),
    )
  }
</script>

<div
  role="list"
  class="track-list__items"
  aria-label="Tracks"
>
  {#each tracks as track (track.id)}
    <TrackListItem
      {track}
      onTogglePlay={handleTogglePlay}
    />
  {/each}
</div>

<style lang="scss">
  .track-list {
    &__items {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
    }
  }
</style>
