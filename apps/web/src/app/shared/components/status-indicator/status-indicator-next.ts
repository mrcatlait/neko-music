import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

type Status = 'failed' | 'caution' | 'undefined' | 'succeeded' | 'progress' | 'pending'

const ICON_MAP: Record<Status, string> = {
  failed: 'block',
  caution: 'warning',
  undefined: 'help', // fix
  succeeded: 'check_circle',
  progress: 'clock_loader_40',
  pending: 'pending',
}

// https://carbondesignsystem.com/patterns/status-indicator-pattern
// convert to icon component
// add shape component
@Component({
  selector: 'n-status-indicator',
  template: `
    <span
      class="status-indicator"
      [attr.data-status-indicator-status]="status()"
    >
      <i class="status-indicator__icon">
        {{ icon() }}
      </i>

      <ng-content />
    </span>
  `,
  styleUrl: './status-indicator-next.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusIndicator {
  readonly status = input.required<Status>()

  protected readonly icon = computed<string>(() => ICON_MAP[this.status()])
}
