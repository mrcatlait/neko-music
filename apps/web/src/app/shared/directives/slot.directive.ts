import { Directive, Input } from '@angular/core'

@Directive({
  selector: '[nekoSlot]',
  standalone: false,
})
export class SlotDirective {
  @Input()
  nekoSlot: 'left' | 'right' = 'left'
}
