<script lang="ts">
  import { playbackQueueSelectors } from '@neko/selectors'
  import { getPlaybackState } from '@/shared/contexts'
  import PlaybackQueueNowPlaying from './playback-queue-now-playing.svelte'
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components'

  const state = getPlaybackState()
</script>

<section
  data-testid={playbackQueueSelectors.queueContainer}
  aria-label="Playback Queue"
>
  <h1>Playback Queue</h1>

  <Tabs
    value="now-playing"
    variant="secondary"
  >
    <TabsList>
      <TabsTrigger
        value="now-playing"
        data-testid={playbackQueueSelectors.queueNowPlayingTabButton}
      >
        <i aria-hidden="true">queue_music</i>Now playing
      </TabsTrigger>
      <TabsTrigger
        value="history"
        data-testid={playbackQueueSelectors.queueHistoryTabButton}
      >
        <i aria-hidden="true">history</i>History
      </TabsTrigger>
    </TabsList>
    <TabsContent value="now-playing">
      {#if state.queue?.tracks}
        <PlaybackQueueNowPlaying tracks={state.queue.tracks} />
      {:else}
        <p data-testid={playbackQueueSelectors.emptyQueueMessage}>No tracks in queue</p>
      {/if}
    </TabsContent>
    <TabsContent value="history">
      <!-- <PlaybackQueueHistory tracks={states.queue.tracks} /> -->
    </TabsContent>
  </Tabs>
</section>
