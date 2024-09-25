import { Directive, Input } from '@angular/core'

@Directive({
  selector: '[nekoSlot]',
})
export class SlotDirective {
  @Input()
  nekoSlot: 'left' | 'right' = 'left'
}
