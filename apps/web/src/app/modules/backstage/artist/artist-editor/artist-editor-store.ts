import { inject, Injectable, Provider, signal } from '@angular/core'
import { disabled, form, minLength, required, TreeValidationResult } from '@angular/forms/signals'
import { Router } from '@angular/router'
import { firstValueFrom } from 'rxjs'

import { Artist } from './models'
import { PICTURE_UPLOAD_CONFIG } from '../../shared/constants'

import { MediaApi } from '@/modules/backstage/shared/services'
import { fileSize, fileType } from '@/shared/validators'
import {
  CreateArtistGql,
  CreateArtistInput,
  GenerateArtistArtworkUploadTokenGql,
  GetBackstageArtistGql,
  UpdateArtistGql,
  UpdateArtistInput,
} from '@/shared/generated-types'
import { Snackbar } from '@/shared/snackbar'

export const provideArtistEditorStore = (): Provider[] => {
  return [
    ArtistEditorStore,
    UpdateArtistGql,
    CreateArtistGql,
    GetBackstageArtistGql,
    GenerateArtistArtworkUploadTokenGql,
    MediaApi,
  ]
}

@Injectable()
export class ArtistEditorStore {
  private readonly backstageArtistGql = inject(GetBackstageArtistGql)
  private readonly updateArtistGql = inject(UpdateArtistGql)
  private readonly createArtistGql = inject(CreateArtistGql)
  private readonly generateArtistArtworkUploadTokenGql = inject(GenerateArtistArtworkUploadTokenGql)
  private readonly mediaApi = inject(MediaApi)
  private readonly router = inject(Router)
  private readonly snackbar = inject(Snackbar)

  readonly isBusy = signal(false)
  readonly editingArtistId = signal<string | null>(null)
  readonly existingArtworkUrl = signal<string>('')

  private readonly artistModel = signal<Artist>({
    name: '',
    genres: [],
    verified: false,
    image: null,
  })

  readonly artistForm = form(
    this.artistModel,
    (schemaPath) => {
      required(schemaPath.name, { message: 'Name is required' })
      minLength(schemaPath.genres, 1, { message: 'Please enter at least one genre' })
      required(schemaPath.image, {
        message: 'Image is required',
        when: () => !this.editingArtistId(),
      })
      fileSize(schemaPath.image, PICTURE_UPLOAD_CONFIG.maxFileSize)
      fileType(schemaPath.image, PICTURE_UPLOAD_CONFIG.allowedTypes, {
        message: 'Image must be a JPEG, PNG, or WEBP file',
      })
      disabled(schemaPath, () => this.isBusy())
    },
    {
      submission: {
        action: async (formRoot) => {
          const artist = formRoot().value()
          return this.persistArtist(artist)
        },
        onInvalid: (formRoot) => {
          formRoot.name().markAsTouched()
          formRoot.genres().markAsTouched()
          formRoot.image().markAsTouched()
          formRoot.verified().markAsTouched()
          formRoot().errorSummary()[0]?.fieldTree().focusBoundControl()
        },
      },
    },
  )

  navigateToArtistList(): void {
    this.router.navigate(['/backstage/artists'])
  }

  loadArtistForEditing(id: string): void {
    this.editingArtistId.set(id)
    this.isBusy.set(true)

    this.backstageArtistGql.fetch({ id }).then((result) => {
      if (result.error) {
        this.snackbar.info(result.error.message)
      }

      const artist = result.data?.backstageArtist

      if (artist) {
        this.existingArtworkUrl.set(artist.artwork?.url ?? '')
        this.artistModel.set({
          name: artist.name,
          genres: artist.genres?.map((genre) => genre.id) ?? [],
          verified: artist.verified,
          image: null,
        })
      }

      this.isBusy.set(false)
    })
  }

  private async persistArtist(artist: Artist): Promise<TreeValidationResult | null> {
    this.isBusy.set(true)

    const id = this.editingArtistId()

    if (id) {
      return this.updateArtistGql.mutate({ id, artist: this.getArtistPayload(artist) }).then((result) => {
        if (result.error) {
          return this.serverValidationError(result.error)
        }

        if (!artist.image) {
          return this.completeSubmission()
        }

        return this.uploadArtwork(id, artist.image)
      })
    }

    return this.createArtistGql.mutate({ artist: this.getArtistPayload(artist) }).then((result) => {
      if (result.error) {
        return this.serverValidationError(result.error)
      }

      return this.uploadArtwork(result.data!.createArtist.id, artist.image!)
    })
  }

  private getArtistPayload(artist: Artist): CreateArtistInput | UpdateArtistInput {
    return {
      name: artist.name,
      genres: artist.genres,
      verified: artist.verified,
    }
  }

  private async uploadArtwork(artistId: string, image: File): Promise<TreeValidationResult> {
    const tokenResult = await this.generateArtistArtworkUploadTokenGql.mutate({ id: artistId })

    if (tokenResult.error) {
      return this.serverValidationError(tokenResult.error)
    }

    const token = tokenResult.data!.generateArtistArtworkUploadToken.uploadToken

    return firstValueFrom(this.mediaApi.upload(image, token))
      .then(() => this.completeSubmission())
      .catch((error) => this.serverValidationError(error))
  }

  private completeSubmission(): TreeValidationResult {
    this.isBusy.set(false)
    this.navigateToArtistList()

    return null
  }

  private serverValidationError(error: Error): TreeValidationResult {
    return { kind: 'server', message: error.message }
  }
}
