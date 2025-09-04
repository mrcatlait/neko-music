import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  effect,
  inject,
  input,
} from '@angular/core'

import { withStyles } from '@/core/providers'

type Colors = 'primary' | 'secondary'

@Component({
  template: '',
  styleUrl: './slider.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'n-slider',
  },
})
class SliderStyles {}

@Directive({
  selector: 'input[type=range][nSlider]',
  host: {
    '[attr.data-slider-color]': 'color()',
  },
})
export class Slider {
  private readonly elRef = inject(ElementRef)

  readonly color = input<Colors>('primary')
  readonly value = input<number | null>(null)

  protected readonly styles = withStyles(SliderStyles)

  constructor() {
    effect(() => {
      this.element.value = String(this.value())
      this.onInput()
    })
  }

  @HostListener('input') onInput() {
    const ratio =
      (Number(this.element.value) - Number(this.element.min)) / (Number(this.element.max) - Number(this.element.min)) ||
      0
    this.element.style.setProperty('--n-slider-fill-ratio', String(ratio))
  }

  @HostListener('mouseup') onMouseUp() {
    this.element.blur()
  }

  private get element(): HTMLInputElement {
    return this.elRef.nativeElement
  }
}
