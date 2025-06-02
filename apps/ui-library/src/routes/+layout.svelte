<script lang="ts">
  import { navigating } from '$app/state';

  import '@neko/design-system/styles/main.scss';
  const { children } = $props();
</script>

<!-- {#if navigating.complete}
	<h1>Loading...</h1>
{/if} -->

<main>
	{@render children()}
</main>
