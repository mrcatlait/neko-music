<script lang="ts">
  import { Slider, IconButton } from '@/shared/components'
  import { getPlaybackState } from '@/shared/contexts'

  const state = getPlaybackState()

  function getValue() {
    return volume
  }

  function setValue(value: number) {
    state.setVolume(value)
  }

  function toggleMute() {
    state.toggleMute()
  }

  const volume = $derived(state.muted ? 0 : state.volume)
  const icon = $derived(state.muted ? 'volume_off' : state.volume > 0.5 ? 'volume_up' : 'volume_down')
</script>

<div class="volume-control">
  <IconButton onclick={toggleMute}><i>{icon}</i></IconButton>

  <Slider
    tabindex={0}
    aria-label="Volume"
    bind:value={getValue, setValue}
    min={0}
    max={100}
    step={1}
    type="single"
    role="slider"
    color="secondary"
    orientation="horizontal"
  />
</div>

<style>
  .volume-control {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 160px;
  }
</style>
