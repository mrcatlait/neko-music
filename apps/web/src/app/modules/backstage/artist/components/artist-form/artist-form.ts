import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Contracts } from '@neko/contracts'
import { disabled, form, FormField, minLength, required } from '@angular/forms/signals'

import { LoadingIndicator, Textfield, Button } from '@/shared/components'
import { GenreAutocomplete, PictureUpload } from '@/modules/backstage/shared/components'
import { ArtworkPipe } from '@/shared/pipes'

interface ArtistModel {
  name: string
  genres: string[]
}

@Component({
  selector: 'n-artist-form',
  imports: [
    ArtworkPipe,
    Button,
    LoadingIndicator,
    FormField,
    PictureUpload,
    ReactiveFormsModule,
    Textfield,
    GenreAutocomplete,
  ],
  templateUrl: './artist-form.html',
  styleUrl: './artist-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistForm {
  readonly submitLabel = input.required<string>()
  readonly saving = input.required<boolean>()
  readonly artist = input<Contracts.Backstage.Artists.Artist>()

  readonly formSubmit = output<{ name: string; genres: string[]; image: File | null }>()
  readonly formCancel = output<void>()

  protected readonly artworkUrl = computed(() => this.artist()?.artwork?.url ?? '')

  private readonly artistModel = linkedSignal<ArtistModel>(() => ({
    name: this.artist()?.name ?? '',
    genres: this.artist()?.genres ?? [],
  }))
  protected readonly artistForm = form(this.artistModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' })
    minLength(schemaPath.genres, 1, { message: 'Please enter at least one genre' })
    disabled(schemaPath, () => this.saving())
  })

  private image: File | null = null

  protected onSelectedFile(file: File): void {
    this.image = file
  }

  protected submit(event: Event): void {
    event.preventDefault()

    if (this.artistForm().invalid()) {
      this.artistForm.name().markAsTouched()
      this.artistForm.genres().markAsTouched()
      return
    }

    const artist = this.artistModel()

    this.formSubmit.emit({
      name: artist.name,
      genres: artist.genres,
      image: this.image,
    })
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
