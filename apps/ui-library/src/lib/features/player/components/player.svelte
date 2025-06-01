<script lang="ts">
  import PlayerControls from './player-controls.svelte';
  import PlayerContext from '../contexts/player.context.svelte';
  import TrackInfo from './track-info.svelte';
  import VolumeControl from './volume-control.svelte';
  import { Button } from '@neko/design-system';
  // import QueueToggle from './queue-toggle.svelte';

  // let showQueue = $state<boolean>(false);
</script>

<div class="player">
  <PlayerContext>
    <div class="player-content">
      <TrackInfo />
      <PlayerControls />
      <div class="player-actions">
        <VolumeControl />
        <!-- <QueueToggle bind:showQueue /> -->
      </div>
    </div>
  </PlayerContext>
  
  <Button>
    Hello
  </Button>
</div>

<style>
  .player {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    padding: 1rem;
    z-index: 1000;
  }

  .player-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 1rem;
    align-items: center;
  }

  .player-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
</style>
