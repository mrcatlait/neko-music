import { Injectable } from '@nestjs/common'

import { CreateBackstageAlbumValidator } from './create-backstage-album.validator'
import { AlbumCreationRequest } from '../../../dtos'
import { PublishingStatus } from '../../../enums'
import { AlbumRepository } from '../../../repositories'
import { CreateBackstageTrackUseCase } from '../../tracks'

import { UseCase } from '@/modules/shared/interfaces'

export type CreateBackstageAlbumUseCaseParams = AlbumCreationRequest

export interface CreateBackstageAlbumUseCaseResult {
  readonly albumId: string
  readonly tracks: string[]
}

@Injectable()
export class CreateBackstageAlbumUseCase implements UseCase<
  CreateBackstageAlbumUseCaseParams,
  CreateBackstageAlbumUseCaseResult
> {
  constructor(
    private readonly createBackstageAlbumValidator: CreateBackstageAlbumValidator,
    private readonly albumRepository: AlbumRepository,
    private readonly createBackstageTrackUseCase: CreateBackstageTrackUseCase,
  ) {}

  async invoke(params: CreateBackstageAlbumUseCaseParams): Promise<CreateBackstageAlbumUseCaseResult> {
    await this.createBackstageAlbumValidator.validate(params)

    const album = await this.albumRepository.createAlbumWithGenresAndArtists({
      album: {
        name: params.name,
        status: PublishingStatus.Draft,
        releaseDate: new Date(params.releaseDate),
        type: params.type,
        explicit: params.explicit,
      },
      genres: params.genres,
      artists: params.artists,
    })

    const tracks: string[] = []

    for (const track of params.tracks) {
      const result = await this.createBackstageTrackUseCase.invoke({
        name: track.name,
        albumId: album.id,
        releaseDate: new Date(track.releaseDate),
        diskNumber: track.diskNumber,
        trackNumber: track.trackNumber,
        type: track.type,
        explicit: track.explicit,
        genres: track.genres,
        artists: track.artists,
      })

      tracks.push(result.id)
    }

    return {
      albumId: album.id,
      tracks,
    }
  }
}
