import { ChangeDetectionStrategy, Component, output } from '@angular/core'

import { IconButton } from '@/shared/components'

@Component({
  selector: 'n-input-chip',
  imports: [IconButton],
  templateUrl: './input-chip.html',
  styleUrl: './input-chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputChip {
  readonly remove = output<void>()

  protected onRemove(): void {
    this.remove.emit()
  }
}
