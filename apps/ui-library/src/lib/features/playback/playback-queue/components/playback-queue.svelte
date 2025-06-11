<script lang="ts">
  import { getPlaybackState } from '@/shared/contexts'

  const states = getPlaybackState()

  interface Props {
    tracks: string[]
  }

  const { tracks }: Props = $props()
</script>

<div data-testid="playback-queue">
  <h1>Playback Queue</h1>
  <ul>
    {#if states.queue?.tracks}
      {#each states.queue.tracks as track (track.id)}
        <li data-testid="playback-queue-track">{track.title}</li>
      {/each}
    {:else}
      <li>No tracks in queue</li>
    {/if}
  </ul>
</div>
