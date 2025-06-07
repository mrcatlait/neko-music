<script lang="ts">
  let showQueue = $state<boolean>(false)
</script>

<div class="queue-toggle">
  <button
    class="queue-button"
    on:click={() => (showQueue = !showQueue)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
    </svg>
    <!-- {#if $queue.length > 0}
      <span class="queue-count">{$queue.length}</span>
    {/if} -->
  </button>
</div>

<style>
  .queue-toggle {
    position: relative;
  }

  .queue-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }

  .queue-button:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .queue-button svg {
    width: 20px;
    height: 20px;
  }

  .queue-count {
    position: absolute;
    top: 0;
    right: 0;
    background: #1db954;
    color: white;
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    border-radius: 1rem;
    transform: translate(50%, -50%);
  }
</style>
