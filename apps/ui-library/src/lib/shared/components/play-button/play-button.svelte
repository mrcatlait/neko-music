<script lang="ts">
  import { blurOnClick } from '@/shared/actions'
  import { getPlaybackState } from '@/shared/contexts'
  import { PLAYBACK_STATUS } from '@/shared/enums'
  import type { WithElementRef } from 'bits-ui'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  type Color = 'primary' | 'secondary'

  type Variant = 'filled' | 'text'

  type Props = WithElementRef<HTMLButtonAttributes> & {
    trackId?: string
    color?: Color
    variant?: Variant
  }

  let { trackId, ref = $bindable(null), color = 'secondary', variant = 'text', ...restProps }: Props = $props()

  const state = getPlaybackState()
  const icon = $derived.by(() => {
    if (state.currentTrack?.id === trackId) {
      return state.status === PLAYBACK_STATUS.Playing ? 'pause' : 'play_arrow'
    }

    return 'play_arrow'
  })
</script>

<button
  bind:this={ref}
  use:blurOnClick
  data-icon-button-root
  data-icon-button-color={color}
  data-icon-button-variant={variant}
  {...restProps}
>
  <i>{icon}</i>
</button>
