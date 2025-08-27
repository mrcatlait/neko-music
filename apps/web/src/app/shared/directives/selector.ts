import { Directive, HostBinding, Input } from '@angular/core'
import { Selectors } from '@neko/selectors'

@Directive({
  selector: '[selector]',
})
export class Selector {
  @HostBinding('attr.data-test')
  @Input({ required: true })
  protected selector!: Selectors
}
