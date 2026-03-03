import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { TitleCasePipe } from '@angular/common'

import { RECORD_STATUSES, RecordStatus } from '../../enums'

@Component({
  selector: 'n-record-status-badge',
  imports: [TitleCasePipe],
  template: `
    <div
      class="record-status-badge label-large"
      [style.background-color]="color()"
    >
      {{ status() | titlecase }}
    </div>
  `,
  styles: [
    `
      .record-status-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: fit-content;
        border-radius: var(--shape-corner-small);
        padding: 0 16px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordStatusBadge {
  status = input.required<RecordStatus>()

  protected readonly color = computed(() => {
    switch (this.status()) {
      case RECORD_STATUSES.Draft:
        return 'var(--color-surface-container-highest)'
      case RECORD_STATUSES.Published:
        return 'var(--color-primary)'
    }
    return 'var(--color-surface-container-highest)'
  })
}
