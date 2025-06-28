<script lang="ts">
  import { browser } from '$app/environment'
  import { AlbumNewReleases } from '@/features/album/album-new-releases'
  import { getPlaybackState } from '@/shared/contexts'
  import { QueueBuilder, TrackBuilder } from '@/shared/test-utils'
  import type { PageProps } from './$types'

  const state = getPlaybackState()

  if (browser) {
    const tracks = Array.from({ length: 30 }).map(() => new TrackBuilder().build())
    const queue = new QueueBuilder().withTracks(tracks).build()

    state.togglePlay(queue)
  }

  const { data }: PageProps = $props()
</script>

<AlbumNewReleases albums={data.albums} />

<div style="height: 2000px;"></div>
<h1>End of page</h1>
