import { Directive, HostBinding, HostListener, Input } from '@angular/core'

type Variants = 'outlined' | 'filled' | 'text'

type Colors = 'primary' | 'secondary'

@Directive({
  selector: 'a[nekoButton],button[nekoButton],a[nekoIconButton],button[nekoIconButton]',
  standalone: false,
})
export class ButtonDirective {
  @Input()
  @HostBinding('attr.data-variant')
  variant: Variants = 'filled'

  @Input()
  @HostBinding('attr.data-color')
  color: Colors = 'primary'

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    const element = event.target as HTMLButtonElement
    element.blur()
  }
}
