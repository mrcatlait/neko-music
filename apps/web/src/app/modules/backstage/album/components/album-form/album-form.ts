import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Contracts } from '@neko/contracts'
import { disabled, form, FormField, minLength, required } from '@angular/forms/signals'

import { LoadingIndicator, Textfield, Button } from '@/shared/components'
import { GenreAutocomplete, PictureUpload } from '@/modules/backstage/shared/components'
import { ArtworkPipe } from '@/shared/pipes'
import { PICTURE_UPLOAD_CONFIG } from '@/modules/backstage/shared/constants'
import { fileSize, fileType } from '@/shared/validators'
import { AlbumType } from '@/shared/enums'

interface AlbumModel {
  name: string
  genres: string[]
  image: File | null
  releaseDate: string
  type: AlbumType
  explicit: boolean
}

@Component({
  selector: 'n-album-form',
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
  templateUrl: './album-form.html',
  styleUrl: './album-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumForm {
  readonly submitLabel = input.required<string>()
  readonly saving = input.required<boolean>()
  readonly album = input<Contracts.Backstage.Albums.CreationRequest & { artwork?: { url: string } }>()

  readonly formSubmit = output<{ name: string; genres: string[]; image: File | null }>()
  readonly formCancel = output<void>()

  private readonly albumModel = linkedSignal<AlbumModel>(() => ({
    name: this.album()?.name ?? '',
    genres: this.album()?.genres ?? [],
    image: null,
    releaseDate: this.album()?.releaseDate ?? '',
    type: this.album()?.type ?? AlbumType.Album,
    explicit: this.album()?.explicit ?? false,
  }))
  protected readonly albumForm = form(this.albumModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' })
    minLength(schemaPath.genres, 1, { message: 'Please enter at least one genre' })
    required(schemaPath.image, { message: 'Image is required', when: () => !this.album() })
    fileSize(schemaPath.image, PICTURE_UPLOAD_CONFIG.maxFileSize)
    fileType(schemaPath.image, PICTURE_UPLOAD_CONFIG.allowedTypes, {
      message: 'Image must be a JPEG, PNG, or WEBP file',
    })
    disabled(schemaPath, () => this.saving())
  })

  protected submit(event: Event): void {
    event.preventDefault()

    if (this.albumForm().invalid()) {
      this.albumForm.name().markAsTouched()
      this.albumForm.genres().markAsTouched()
      this.albumForm.image().markAsTouched()
      return
    }

    const album = this.albumModel()

    this.formSubmit.emit({
      name: album.name,
      genres: album.genres,
      image: album.image,
    })
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
