import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { form, required, FormField, disabled } from '@angular/forms/signals'

import { Button, LoadingIndicator, Textfield } from '@/shared/components'

interface GenreModel {
  name: string
  slug: string
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

  readonly genre = input<GenreModel | null>(null)
  readonly formSubmit = output<GenreModel>()
  readonly formCancel = output<void>()

  private readonly genreModel = linkedSignal<GenreModel>(() => ({
    name: this.genre()?.name ?? '',
    slug: this.genre()?.slug ?? '',
  }))
  protected readonly genreForm = form(this.genreModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' })
    required(schemaPath.slug, { message: 'Slug is required' })
    disabled(schemaPath, () => this.saving())
  })

  protected submit(event: Event): void {
    event.preventDefault()

    if (this.genreForm().invalid() || this.saving()) {
      this.genreForm.name().markAsTouched()
      return
    }

    const genre = this.genreModel()

    this.formSubmit.emit({ name: genre.name, slug: genre.slug })
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
