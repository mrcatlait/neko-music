<script lang="ts">
  import { Slider, type WithoutChildrenOrChild } from 'bits-ui'

  type Props = WithoutChildrenOrChild<Slider.RootProps>

  let {
    value = $bindable(),
    ref = $bindable(null),
    type = 'single',
    orientation = 'horizontal',
    ...restProps
  }: Props = $props()
</script>

<Slider.Root
  bind:value
  bind:ref
  {type}
  {orientation}
  {...restProps as any}
>
  <span data-slider-range-background>
    <Slider.Range />
  </span>
  <Slider.Thumb index={0} />
</Slider.Root>
