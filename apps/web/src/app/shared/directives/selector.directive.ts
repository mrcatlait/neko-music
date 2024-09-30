import { Directive, HostBinding, Input } from '@angular/core'
import { SelectorWithSuffix } from '@selectors'

@Directive({
  selector: '[selector]',
})
export class SelectorDirective {
  @HostBinding('attr.data-test')
  @Input({ required: true })
  selector: SelectorWithSuffix
}
