import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Contracts } from '@neko/contracts'
import { form, required, FormField, disabled } from '@angular/forms/signals'

import { Button, LoadingIndicator, Textfield } from '@/shared/components'

interface GenreModel {
  name: string
}

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

  private readonly genreModel = linkedSignal<GenreModel>(() => ({
    name: this.genre()?.name ?? '',
  }))
  protected readonly genreForm = form(this.genreModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' })
    disabled(schemaPath, () => this.saving())
  })

  protected submit(event: Event): void {
    event.preventDefault()

    if (this.genreForm().invalid() || this.saving()) {
      this.genreForm.name().markAsTouched()
      return
    }

    const genre = this.genreModel()

    this.formSubmit.emit({ name: genre.name })
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
