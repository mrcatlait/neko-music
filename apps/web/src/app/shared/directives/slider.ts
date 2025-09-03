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
  selector: 'input[type=range][nSlider]',
})
export class Slider implements OnChanges {
  private readonly elRef = inject(ElementRef)

  @Input()
  @HostBinding('attr.data-slider-color')
  color: Colors = 'primary'

  @Input() value?: number | null

  ngOnChanges({ value }: SimpleChanges): void {
    if (value) {
      this.element.value = String(this.value)
      this.onInput()
    }
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
