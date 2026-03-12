import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Contracts } from '@neko/contracts'

import { LoadingIndicator, Textfield, Button } from '@/shared/components'
import { GenrePicker, PictureUpload } from '@/modules/backstage/shared/components'
import { ArtworkPipe } from '@/shared/pipes'

@Component({
  selector: 'n-artist-form',
  imports: [ArtworkPipe, Button, LoadingIndicator, PictureUpload, ReactiveFormsModule, Textfield, GenrePicker],
  templateUrl: './artist-form.html',
  styleUrl: './artist-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistForm {
  readonly submitLabel = input.required<string>()
  readonly saving = input.required<boolean>()
  readonly artist = input<Contracts.Backstage.BackstageArtist>()

  readonly formSubmit = output<{ name: string; genres: string[]; image: File | null }>()
  readonly formCancel = output<void>()

  protected readonly artworkUrl = computed(() => this.artist()?.artwork?.url ?? '')

  protected readonly form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  })

  protected readonly selectedGenreIds = signal<string[]>([])

  private image: File | null = null

  constructor() {
    effect(() => {
      const artist = this.artist()

      if (!artist) {
        return
      }

      this.form.patchValue({ name: artist.name })
      this.selectedGenreIds.set(artist.genres)
    })
  }

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
