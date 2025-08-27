import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'

@Component({
  selector: 'n-linear-progress',
  templateUrl: './linear-progress.html',
  styleUrl: './linear-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinearProgress {
  readonly buffer = input<number>(0)

  protected readonly bufferWidth = computed(() => `${this.buffer()}%`)
  protected readonly isComplete = computed(() => this.buffer() >= 100)
}
