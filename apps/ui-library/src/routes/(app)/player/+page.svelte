<script>
  import { PlaybackQueue } from '@/features/playback/playback-queue'
  import { getPlaybackState } from '@/shared/contexts'
  import { QueueBuilder } from '@/shared/test-utils'

  const state = getPlaybackState()

  const queue = new QueueBuilder().build()

  state.togglePlay(queue)
</script>

<h1>Player</h1>

<PlaybackQueue />

<div style="height: 2000px;"></div>
<h1>End of page</h1>
