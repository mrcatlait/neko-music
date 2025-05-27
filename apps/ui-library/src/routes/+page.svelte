<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<button on:click={() => goto('/context')}>Go to Context</button>
<button on:click={() => goto('/player')}>Go to Player</button>