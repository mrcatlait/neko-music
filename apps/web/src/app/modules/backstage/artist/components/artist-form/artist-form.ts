import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'

import { LoadingIndicator, Textfield, Button } from '@/shared/components'
import { GenrePicker, PictureUpload } from '@/modules/backstage/shared/components'

@Component({
  selector: 'n-artist-form',
  imports: [Button, LoadingIndicator, PictureUpload, ReactiveFormsModule, Textfield, GenrePicker],
  templateUrl: './artist-form.html',
  styleUrl: './artist-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistForm {
  readonly submitLabel = input.required<string>()
  readonly saving = input.required<boolean>()

  readonly formSubmit = output<{ name: string; genres: string[]; image: File }>()
  readonly formCancel = output<void>()

  protected readonly form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  })

  protected readonly selectedGenreIds = signal<string[]>([])

  private image: File | null = null

  protected get name(): FormControl {
    return this.form.controls.name
  }

  protected onSelectedFile(file: File): void {
    this.image = file
  }

  protected onGenreSelectionChange(genreIds: string[]): void {
    this.selectedGenreIds.set(genreIds)
  }

  protected submit(): void {
    if (this.form.invalid || !this.image) {
      this.form.markAllAsTouched()
      return
    }

    const name = this.form.controls.name.value

    if (name) {
      this.formSubmit.emit({
        name,
        genres: this.selectedGenreIds(),
        image: this.image,
      })
    }
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
