import { Directive, Input, HostBinding } from '@angular/core'

type Variants = 'assist' | 'filter' | 'input' | 'suggestion'

@Directive({
  selector: '[nekoChip]',
})
export class ChipDirective {
  @Input()
  @HostBinding('attr.data-variant')
  variant: Variants = 'assist'
}
