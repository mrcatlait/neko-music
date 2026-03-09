import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

import { Button, LoadingIndicator, Textfield } from '@/shared/components'

@Component({
  selector: 'n-genre-form',
  templateUrl: './genre-form.html',
  styleUrl: './genre-form.scss',
  imports: [Button, LoadingIndicator, ReactiveFormsModule, Textfield],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreForm {
  readonly submitLabel = input.required<string>()
  readonly saving = input.required<boolean>()

  readonly formSubmit = output<{ name: string }>()
  readonly formCancel = output<void>()

  protected readonly form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  })

  protected get name(): FormControl {
    return this.form.controls.name
  }

  protected submit(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched()
      return
    }

    const name = this.name.value

    if (name) {
      this.formSubmit.emit({ name })
    }
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
