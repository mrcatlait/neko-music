import { ChangeDetectionStrategy, Component, input } from '@angular/core'

type Colors = 'primary' | 'secondary'

@Component({
  selector: 'n-loading-indicator',
  template: `<span
    class="loading-indicator"
    [attr.data-loading-indicator-color]="color()"
    [style.--n-loading-indicator-size]="size() + 'px'"
  >
    <span class="loading-indicator__dot"></span>
    <span class="loading-indicator__dot"></span>
    <span class="loading-indicator__dot"></span>
  </span>`,
  styleUrl: './loading-indicator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingIndicator {
  readonly color = input<Colors>()

  readonly size = input<number>(16)
}
