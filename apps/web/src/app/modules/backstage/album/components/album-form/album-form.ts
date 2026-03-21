import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { Contracts } from '@neko/contracts'
import { disabled, form, FormField, minLength, required } from '@angular/forms/signals'

import { LoadingIndicator, Textfield, Button, Switch } from '@/shared/components'
import {
  ArtistAutocomplete,
  AudioFileUpload,
  GenreAutocomplete,
  PictureUpload,
} from '@/modules/backstage/shared/components'
import { ArtworkPipe } from '@/shared/pipes'
import { AUDIO_UPLOAD_CONFIG, PICTURE_UPLOAD_CONFIG } from '@/modules/backstage/shared/constants'
import { fileSize, fileType } from '@/shared/validators'
import { AlbumType } from '@/shared/enums'

export interface AlbumModel {
  name: string
  genres: string[]
  artists: string[]
  image: File | null
  audio: File | null
  releaseDate: string
  type: AlbumType
  explicit: boolean
}

@Component({
  selector: 'n-album-form',
  imports: [
    ArtworkPipe,
    ArtistAutocomplete,
    AudioFileUpload,
    Button,
    LoadingIndicator,
    FormField,
    PictureUpload,
    ReactiveFormsModule,
    Textfield,
    GenreAutocomplete,
    Switch,
  ],
  templateUrl: './album-form.html',
  styleUrl: './album-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumForm {
  readonly submitLabel = input.required<string>()
  readonly saving = input.required<boolean>()
  readonly album = input<Contracts.Backstage.Albums.CreationRequest & { artwork?: { url: string } }>()
  /** When true, an audio file is required (single release). */
  readonly requireAudio = input(false)
  /** When false, action buttons are hidden so a parent form can submit. */
  readonly showFormActions = input(true)

  readonly formSubmit = output<AlbumModel>()
  readonly formCancel = output<void>()

  private readonly albumModel = linkedSignal<AlbumModel>(() => ({
    name: this.album()?.name ?? '',
    genres: this.album()?.genres ?? [],
    artists: this.album()?.artists?.map((a) => a.id) ?? [],
    image: null,
    audio: null,
    releaseDate: this.album()?.releaseDate ?? '',
    type: this.album()?.type ?? AlbumType.Album,
    explicit: this.album()?.explicit ?? false,
  }))

  protected readonly albumForm = form(this.albumModel, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' })
    minLength(schemaPath.genres, 1, { message: 'Please enter at least one genre' })
    minLength(schemaPath.artists, 1, { message: 'Please select at least one artist' })
    required(schemaPath.image, { message: 'Image is required', when: () => !this.album() })
    fileSize(schemaPath.image, PICTURE_UPLOAD_CONFIG.maxFileSize)
    fileType(schemaPath.image, PICTURE_UPLOAD_CONFIG.allowedTypes, {
      message: 'Image must be a JPEG, PNG, or WEBP file',
    })
    required(schemaPath.audio, {
      message: 'Audio file is required',
      when: () => this.requireAudio(),
    })
    fileSize(schemaPath.audio, AUDIO_UPLOAD_CONFIG.maxFileSize)
    fileType(schemaPath.audio, AUDIO_UPLOAD_CONFIG.allowedTypes, {
      message: 'Unsupported audio format',
    })
    disabled(schemaPath, () => this.saving())
  })

  protected readonly showAudio = computed(() => this.requireAudio())

  protected submit(event: Event): void {
    event.preventDefault()

    if (this.albumForm().invalid()) {
      this.albumForm.name().markAsTouched()
      this.albumForm.genres().markAsTouched()
      this.albumForm.artists().markAsTouched()
      this.albumForm.image().markAsTouched()

      if (this.requireAudio()) {
        this.albumForm.audio().markAsTouched()
      }
    }

    const album = this.albumModel()

    this.formSubmit.emit(album)
  }

  protected cancel(): void {
    this.formCancel.emit()
  }
}
