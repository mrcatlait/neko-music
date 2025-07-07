<script lang="ts">
  import type { PageProps } from './$types'
  import { AlbumDetails } from '@/features/album/album-details'

  const { data }: PageProps = $props()
</script>

<AlbumDetails
  album={data.album}
  tracks={data.tracks}
/>
