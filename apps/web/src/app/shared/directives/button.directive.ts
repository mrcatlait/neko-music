import { Directive, HostBinding, Input } from '@angular/core'

type VariantFilled = 'filled'
type VariantOutlined = 'outlined'
type VariantText = 'text'

type Variants = VariantFilled | VariantOutlined | VariantText

type Colors = 'primary' | 'secondary'

@Directive({
  selector: 'a[nekoButton],button[nekoButton],a[nekoIconButton],button[nekoIconButton]',
})
export class ButtonDirective {
  @Input()
  @HostBinding('attr.data-variant')
  variant: Variants = 'filled'

  @Input()
  @HostBinding('attr.data-color')
  color: Colors = 'primary'
}
