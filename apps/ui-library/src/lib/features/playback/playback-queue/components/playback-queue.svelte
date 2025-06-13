<script lang="ts">
  import { playbackQueueSelectors } from '@neko/selectors'
  import { getPlaybackState } from '@/shared/contexts'
  import PlaybackQueueNext from './playback-queue-next.svelte'
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components'

  const states = getPlaybackState()
</script>

<section
  data-testid={playbackQueueSelectors.queueContainer}
  aria-label="Playback Queue"
>
  <h1>Playback Queue</h1>

  <Tabs
    value="next"
    variant="secondary"
  >
    <TabsList>
      <TabsTrigger
        value="next"
        data-testid={playbackQueueSelectors.queueNextTabButton}
      >
        <i aria-hidden="true">queue_music</i>Next
      </TabsTrigger>
      <TabsTrigger
        value="history"
        data-testid={playbackQueueSelectors.queueHistoryTabButton}
      >
        <i aria-hidden="true">history</i>History
      </TabsTrigger>
    </TabsList>
    <TabsContent value="next">
      {#if states.queue?.tracks}
        <PlaybackQueueNext tracks={states.queue.tracks} />
      {:else}
        <p data-testid={playbackQueueSelectors.emptyQueueMessage}>No tracks in queue</p>
      {/if}
    </TabsContent>
    <TabsContent value="history">
      <!-- <PlaybackQueueHistory tracks={states.queue.tracks} /> -->
    </TabsContent>
  </Tabs>
</section>
