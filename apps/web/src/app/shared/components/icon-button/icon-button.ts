import { input, Directive, Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core'

import { withStyles } from '@/core/providers'

type Colors = 'filled' | 'tonal' | 'standard' | 'outlined'
type Sizes = 'x-small' | 'small' | 'medium' | 'large' | 'x-large'

@Component({
  template: '',
  styleUrl: './icon-button.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'n-icon-button',
  },
})
class IconButtonStyles {}

@Directive({
  selector: 'a[nIconButton],button[nIconButton]',
  host: {
    '[attr.data-icon-button-color]': 'color()',
    '[attr.data-icon-button-size]': 'size()',
  },
})
export class IconButton {
  readonly color = input<Colors>('standard')
  readonly size = input<Sizes>('small')

  protected readonly styles = withStyles(IconButtonStyles)
}
