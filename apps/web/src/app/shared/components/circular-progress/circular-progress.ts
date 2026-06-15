import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

@Component({
  selector: 'n-circular-progress',
  templateUrl: './circular-progress.html',
  styleUrl: './circular-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircularProgress {
  readonly buffer = input<number>(0)
  readonly size = input<number>(40)
  readonly trackWidth = input<number>(4)
  readonly gap = input<number>(2)

  private readonly normalizedGap = computed(() => (this.gap() / this.size()) * 100)

  protected readonly normalizedBuffer = computed(() => this.clampPercentage(this.buffer()))
  protected readonly viewBox = computed(() => `0 0 ${this.size()} ${this.size()}`)

  protected readonly center = computed(() => this.size() / 2)

  protected readonly radius = computed(() => Math.max(0, this.center() - this.trackWidth() / 2))

  protected readonly activeDasharray = computed(() => `${this.normalizedBuffer()} 100`)
  protected readonly trackDasharray = computed(() => `${100 - this.normalizedBuffer() - this.normalizedGap() * 2} 100`)
  protected readonly trackDashoffset = computed(() => -(this.normalizedBuffer() + this.normalizedGap()))

  private clampPercentage(value: number): number {
    return Math.min(100, Math.max(0, value))
  }
}
