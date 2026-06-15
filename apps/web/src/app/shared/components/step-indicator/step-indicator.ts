import { ChangeDetectionStrategy, Component, input } from '@angular/core'

@Component({
  selector: 'n-step-indicator',
  templateUrl: './step-indicator.html',
  styleUrl: './step-indicator.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepIndicator {
  steps = input.required<string[]>()
  currentStep = input<number>(0)
}
