<script lang="ts">
  import { getPlaybackState } from '@/shared/contexts/playback.context.svelte'
  import NowPlaying from './components/now-playing.svelte'
  import QueueList from './components/queue-list.svelte'

  const playbackState = getPlaybackState()

  let isHistoryExpanded = $state(false)
</script>

<section
  class="queue-manager"
  role="region"
  aria-label="Music Queue Manager"
>
  <NowPlaying currentTrack={playbackState.currentTrack} />
  <QueueList
    tracks={playbackState.tracks}
    onTrackClick={(trackId: string) => playbackState.togglePlay(playbackState.queue!, trackId)}
    onTrackRemove={(trackId: string) => playbackState.removeFromQueue(trackId)}
  />
</section>

<style lang="scss">
  .queue-manager {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--color-surface);
    padding: 1rem;
    gap: 1.5rem;

    // Tablet layout - medium (600px - 840px)
    @media (min-width: 600px) and (max-width: 839px) {
      padding: 1.5rem;
      gap: 2rem;
    }

    // Desktop layout - expanded/large/extra-large (840px+)
    @media (min-width: 840px) {
      padding: 2rem;
      gap: 3rem;
      display: grid;
      grid-template-columns: 1fr;
      max-width: 1200px;
      margin: 0 auto;
    }
  }
</style>
