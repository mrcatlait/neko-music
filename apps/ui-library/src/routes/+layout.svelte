<script lang="ts">
  import { navigating } from '$app/state';

  const { children } = $props();
</script>

<!-- {#if navigating.complete}
	<h1>Loading...</h1>
{/if} -->

<main>
	{@render children()}
</main>
