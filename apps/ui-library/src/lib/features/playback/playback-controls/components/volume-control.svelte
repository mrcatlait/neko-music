<script lang="ts">
  import { DropdownMenu } from 'bits-ui'
  import { Slider, MenuContent, IconButton, MenuTrigger } from '@/shared/components'
  import { getPlaybackState } from '@/shared/contexts'

  const state = getPlaybackState()

  function getValue() {
    return state.volume
  }

  function setValue(value: number) {
    state.setVolume(value)
  }
</script>

<DropdownMenu.Root>
  <MenuTrigger>
    {#snippet child({ props })}
      <IconButton {...props}><i>volume_up</i></IconButton>
    {/snippet}
  </MenuTrigger>

  <MenuContent class="volume-control-container">
    <div class="volume-control-slider">
      <Slider
        tabindex={0}
        aria-label="Volume"
        bind:value={getValue, setValue}
        min={0}
        max={1}
        step={0.01}
        type="single"
        role="slider"
        color="secondary"
        orientation="vertical"
      />
    </div>
  </MenuContent>
</DropdownMenu.Root>

<style>
  :global(.volume-control-container) {
    min-width: 0 !important;
  }

  .volume-control-slider {
    padding: 8px;
    height: 160px;
  }
</style>
