<script lang="ts">
  import { page } from '$app/state'

  const { error, status } = page
</script>

<h1>Error</h1>
<p>
  {error?.message}
</p>

<p>
  {status}
</p>
