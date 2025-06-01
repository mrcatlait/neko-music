<script lang="ts">
  import { getPlayerState } from '$lib/features/player/contexts/player.context.svelte';

  const state = getPlayerState();

  let isMuted = false;
  let previousVolume = state.volume;

  function toggleMute() {
    if (isMuted) {
      state.setVolume({ volume: previousVolume });
      isMuted = false;
    } else {
      previousVolume = state.volume;
      state.setVolume({ volume: 0 });
      isMuted = true;
    }
  }

  function handleVolumeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const newVolume = parseFloat(input.value);
    state.setVolume({ volume: newVolume });
    isMuted = newVolume === 0;
  }
</script>

<div class="volume-control">
  <button class="volume-button" on:click={toggleMute}>
    {#if state.volume === 0}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      </svg>
    {:else if state.volume < 0.5}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 9v6h4l5 5V4L9 9H5z" />
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      </svg>
    {/if}
  </button>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={state.volume}
    on:input={handleVolumeChange}
    class="volume-slider"
  />
</div>

<style>
  .volume-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .volume-button {
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

  .volume-button:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .volume-button svg {
    width: 20px;
    height: 20px;
  }

  .volume-slider {
    width: 100px;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    outline: none;
  }

  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }

  .volume-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
</style>
