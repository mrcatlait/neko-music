<script lang="ts">
  import type { PageProps } from './$types'

  const { data }: PageProps = $props()
</script>

<h1>{data.album}</h1>
