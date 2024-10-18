import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core'

type Colors = 'primary' | 'secondary'

@Directive({
  selector: 'input[nekoSlider]',
  host: {
    type: 'range',
  },
})
export class SliderDirective implements OnChanges {
  private readonly elRef = inject(ElementRef)

  @Input()
  @HostBinding('attr.data-color')
  color: Colors = 'primary'

  @Input() value?: number | null

  ngOnChanges({ value }: SimpleChanges): void {
    if (value) {
      this.element.value = String(this.value)
      this.onInput(this.element)
    }
  }

  @HostListener('input', ['$event.target']) onInput(element: HTMLInputElement) {
    const ratio = (Number(element.value) - Number(element.min)) / (Number(element.max) - Number(element.min)) || 0
    this.element.style.setProperty('--n-slider-fill-ratio', String(ratio))
  }

  private get element(): HTMLInputElement {
    return this.elRef.nativeElement
  }
}
