<script lang="ts">
  import { Slider, type WithoutChildrenOrChild } from 'bits-ui'

  type Color = 'primary' | 'secondary'

  type Props = WithoutChildrenOrChild<Slider.RootProps> & {
    hideThumb?: boolean
    color?: Color
  }

  let {
    value = $bindable(),
    ref = $bindable(null),
    type = 'single',
    orientation = 'horizontal',
    hideThumb,
    color = 'primary',
    ...restProps
  }: Props = $props()
</script>

<Slider.Root
  bind:value
  bind:ref
  {type}
  {orientation}
  data-slider-color={color}
  {...restProps as any}
>
  <span data-slider-range-background>
    <Slider.Range />
  </span>
  <Slider.Thumb
    index={0}
    data-slider-thumb-hide={hideThumb}
  />
</Slider.Root>
