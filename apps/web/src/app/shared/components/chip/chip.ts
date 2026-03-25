import { ChangeDetectionStrategy, Component, Directive, input, ViewEncapsulation } from '@angular/core'

import { withStyles } from '@/core/providers'

type Variants = 'outlined' | 'filled'

@Component({
  template: '',
  styleUrl: './chip.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'n-chip',
  },
})
class ChipStyles {}

@Directive({
  selector: 'n-chip,[nChip]',
  host: {
    // '[attr.data-chip-variant]': 'variant()',
  },
})
export class Chip {
  // readonly variant = input<Variants>('outlined')

  readonly styles = withStyles(ChipStyles)
}
