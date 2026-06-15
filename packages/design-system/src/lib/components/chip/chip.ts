import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core'

import { withStyles } from '../../internal/with-styles'

@Component({
  template: '',
  styleUrl: './chip.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'n-chip',
  },
})
class ChipStyles {}

@Directive({
  selector: 'n-chip,[nChip]',
  standalone: true,
})
export class Chip {
  protected readonly styles = withStyles(ChipStyles)
}
