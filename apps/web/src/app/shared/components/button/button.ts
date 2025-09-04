import { input, Directive, Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core'

import { withStyles } from '@/core/providers'

type Variants = 'outlined' | 'filled' | 'text'
type Colors = 'primary' | 'secondary'

@Component({
  template: '',
  styleUrl: './button.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'n-button',
  },
})
class ButtonStyles {}

@Directive({
  selector: 'a[nButton],button[nButton]',
  host: {
    '[attr.data-button-variant]': 'variant()',
    '[attr.data-button-color]': 'color()',
  },
})
export class Button {
  readonly variant = input<Variants>('filled')
  readonly color = input<Colors>('primary')

  protected readonly styles = withStyles(ButtonStyles)
}
