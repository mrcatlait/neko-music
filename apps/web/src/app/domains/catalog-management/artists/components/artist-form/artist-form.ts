import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Contracts } from '@neko/contracts'

import { LoadingIndicator, Textfield, Button, InputChip } from '@/shared/components'

@Component({
  selector: 'n-artist-form',
  imports: [Button, InputChip, LoadingIndicator, ReactiveFormsModule, Textfield],
  templateUrl: './artist-form.html',
  styleUrl: './artist-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistForm {
  readonly submitLabel = input.required<string>()
  readonly saving = input.required<boolean>()
  readonly availableGenres = input.required<Contracts.CatalogManagement.GenreResponse[]>()

  readonly formSubmit = output<{ name: string; genres: string[] }>()
  readonly formCancel = output<void>()

  protected readonly form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    genres: new FormControl<string[]>([], [Validators.required]),
  })

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const name = this.form.controls.name.value
    const genres = this.form.controls.genres.value || []

    if (name) {
      this.formSubmit.emit({
        name,
        genres,
      })
    }
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
