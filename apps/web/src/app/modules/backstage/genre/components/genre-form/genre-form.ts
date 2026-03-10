import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Contracts } from '@neko/contracts'
import { form, required, FormField } from '@angular/forms/signals'

import { Button, LoadingIndicator, Textfield } from '@/shared/components'

@Component({
  selector: 'n-genre-form',
  templateUrl: './genre-form.html',
  styleUrl: './genre-form.scss',
  imports: [Button, LoadingIndicator, ReactiveFormsModule, Textfield, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreForm {
  readonly submitLabel = input.required<string>()
  readonly saving = input.required<boolean>()

  readonly genre = input<Contracts.Backstage.Genre | null>(null)
  readonly formSubmit = output<{ name: string }>()
  readonly formCancel = output<void>()

  private readonly genreName = linkedSignal<string>(() => this.genre()?.name ?? '')
  protected readonly genreForm = form(this.genreName, (schemaPath) => {
    required(schemaPath)
  })
  protected readonly hasRequiredError = computed(() => this.name.errors().some((error) => error.kind === 'required'))

  protected get name() {
    return this.genreForm()
  }

  protected submit(): void {
    if (this.name.invalid() || this.saving()) {
      this.name.markAsTouched()
      return
    }

    const name = this.name.value()

    if (name) {
      this.formSubmit.emit({ name })
    }
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
