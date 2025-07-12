<script lang="ts">
  import type { Queue } from '@/shared/models'
  import TrackListItem from './track-list-item.svelte'
  import { getPlaybackState } from '@/shared/contexts'

  interface Props {
    queue: Queue
  }

  const { queue }: Props = $props()

  const playbackState = getPlaybackState()

  const handleTogglePlay = (trackId: string) => {
    // Use existing queue data - no fetching needed!
    playbackState.queue.setupQueue(
      {
        tracks: queue.tracks,
        metadata: {
          name: queue.name,
          description: `${queue.type} • ${queue.tracks.length} tracks`,
          type: queue.type,
        },
      },
      {
        startFromTrack: trackId,
      },
    )
  }
</script>

<div
  role="list"
  class="track-list__items"
  aria-label="Tracks"
>
  {#each queue.tracks as track (track.id)}
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
