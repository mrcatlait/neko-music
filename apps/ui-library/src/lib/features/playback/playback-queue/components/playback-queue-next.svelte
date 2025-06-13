<script lang="ts">
  import type { Track } from '@/shared/models'
  import { playbackQueueSelectors } from '@neko/selectors'

  interface Props {
    tracks: Track[]
  }

  let { tracks }: Props = $props()
</script>

<ul
  role="list"
  data-testid={playbackQueueSelectors.queueNextContainer}
>
  {#each tracks as track (track.id)}
    <li data-testid={playbackQueueSelectors.queueNextTrackItem}>{track.title}</li>
  {/each}
</ul>
