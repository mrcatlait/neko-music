import { Directive, HostBinding, Input } from '@angular/core'

type Variants = 'outlined' | 'filled' | 'text'

type Colors = 'primary' | 'secondary'

@Directive({
  selector: 'a[nButton],button[nButton],a[nIconButton],button[nIconButton]',
})
export class Button {
  @Input()
  @HostBinding('attr.data-button-variant')
  variant: Variants = 'filled'

  @Input()
  @HostBinding('attr.data-button-color')
  color: Colors = 'primary'
}
