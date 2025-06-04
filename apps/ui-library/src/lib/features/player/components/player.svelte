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
  
  <Button variant="filled" color="primary">
    Hello
  </Button>
</div>

<style>
  .player {
    --n-player-height: 80px;

    display: block;
    height: var(--n-player-height);
  }
</style>
