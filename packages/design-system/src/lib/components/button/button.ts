import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation, input } from '@angular/core'

import { withStyles } from '../../internal/with-styles'

export type ButtonVariant = 'outlined' | 'filled' | 'text'
export type ButtonColor = 'primary' | 'secondary'

@Component({
  template: '',
  styleUrl: './button.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'n-button',
  },
})
class ButtonStyles {}

@Directive({
  selector: 'a[nButton],button[nButton]',
  standalone: true,
  host: {
    '[attr.data-button-variant]': 'variant()',
    '[attr.data-button-color]': 'color()',
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('filled')
  readonly color = input<ButtonColor>('primary')

  protected readonly styles = withStyles(ButtonStyles)
}
