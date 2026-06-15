import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

import {
  formatStatusIndicatorCount,
  resolveStatusIndicator,
  type StatusIndicatorSize,
  type StatusIndicatorTone,
  type StatusIndicatorVariant,
} from './status-indicator.utils'

// https://carbondesignsystem.com/patterns/status-indicator-pattern/
@Component({
  selector: 'n-status-indicator',
  template: `
    <span
      class="n-status-indicator"
      [attr.aria-label]="computedAriaLabel()"
      [attr.data-status-indicator-size]="size()"
      [attr.data-status-indicator-tone]="resolved().tone"
      [attr.data-status-indicator-variant]="variant()"
    >
      @if (variant() === 'icon') {
        <i
          aria-hidden="true"
          class="outlined n-status-indicator__icon"
          [attr.data-size]="size() === 'small' ? 'small' : null"
        >
          {{ resolved().icon }}
        </i>
      }

      @if (variant() === 'shape') {
        <span
          aria-hidden="true"
          class="n-status-indicator__shape"
          [attr.data-status-indicator-shape]="resolved().shape"
        ></span>
      }

      @if (variant() === 'badge') {
        <span
          aria-hidden="true"
          class="n-status-indicator__badge"
          [attr.data-status-indicator-badge-has-count]="hasBadgeCount()"
        >
          {{ badgeCountLabel() }}
        </span>
      }

      @if (showLabel()) {
        <span class="n-status-indicator__label">
          {{ resolved().label }}
        </span>
      }
    </span>
  `,
  styleUrl: './status-indicator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusIndicator {
  readonly status = input<string>()
  readonly tone = input<StatusIndicatorTone>()
  readonly icon = input<string>()
  readonly label = input<string>()
  readonly variant = input<StatusIndicatorVariant>('icon')
  readonly size = input<StatusIndicatorSize>('medium')
  readonly count = input<number | null>(null)
  readonly hideLabel = input<boolean>(false)
  readonly ariaLabel = input<string>()

  protected readonly resolved = computed(() =>
    resolveStatusIndicator({
      status: this.status(),
      tone: this.tone(),
      icon: this.icon(),
      label: this.label(),
    }),
  )

  protected readonly showLabel = computed(() => this.variant() !== 'badge' && !this.hideLabel())
  protected readonly badgeCountLabel = computed(() => formatStatusIndicatorCount(this.count() ?? 0))
  protected readonly hasBadgeCount = computed(() => this.badgeCountLabel().length > 0)
  protected readonly computedAriaLabel = computed(() => this.ariaLabel() || this.resolved().label)
}
