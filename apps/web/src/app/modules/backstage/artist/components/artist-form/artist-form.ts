import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Contracts } from '@neko/contracts'
import { disabled, form, FormField, minLength, required } from '@angular/forms/signals'

import { LoadingIndicator, Textfield, Button, Checkbox } from '@/shared/components'
import { GenreAutocomplete, PictureUpload } from '@/modules/backstage/shared/components'
import { fileSize, fileType } from '@/shared/validators'
import { PICTURE_UPLOAD_CONFIG } from '@/modules/backstage/shared/constants'
import { ArtworkPipe } from '@/shared/pipes'

interface ArtistModel {
  name: string
  image: File | null
  genres: string[]
  verified: boolean
}

@Component({
  selector: 'n-artist-form',
  imports: [
    ArtworkPipe,
    Button,
    Checkbox,
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
  readonly artist = input<any>()

  readonly formSubmit = output<{ name: string; genres: string[]; verified: boolean; image: File | null }>()
  readonly formCancel = output<void>()

  private readonly artistModel = linkedSignal<ArtistModel>(() => ({
    name: this.artist()?.name ?? '',
    genres: this.artist()?.genres ?? [],
    verified: this.artist()?.verified ?? false,
    image: null,
  }))
  protected readonly artistForm = form(this.artistModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' })
    minLength(schemaPath.genres, 1, { message: 'Please enter at least one genre' })
    required(schemaPath.image, {
      message: 'Image is required',
      when: () => !this.artist(),
    })
    fileSize(schemaPath.image, PICTURE_UPLOAD_CONFIG.maxFileSize)
    fileType(schemaPath.image, PICTURE_UPLOAD_CONFIG.allowedTypes, {
      message: 'Image must be a JPEG, PNG, or WEBP file',
    })
    disabled(schemaPath, () => this.saving())
  })

  protected submit(event: Event): void {
    event.preventDefault()

    if (this.artistForm().invalid()) {
      this.artistForm.name().markAsTouched()
      this.artistForm.genres().markAsTouched()
      this.artistForm.image().markAsTouched()
      this.artistForm.verified().markAsTouched()
      return
    }

    const artist = this.artistModel()

    this.formSubmit.emit({
      name: artist.name,
      genres: artist.genres,
      verified: artist.verified,
      image: artist.image,
    })
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
