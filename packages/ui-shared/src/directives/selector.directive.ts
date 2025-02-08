import { Directive, HostBinding, Input } from '@angular/core'
import { SelectorWithSuffix } from '@neko/ui-selectors'

@Directive({
  selector: '[selector]',
})
export class SelectorDirective {
  @HostBinding('attr.data-test')
  @Input()
  selector: SelectorWithSuffix
}
