import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { CreateBackstageArtistValidator } from './create-backstage-artist.validator'
import { ArtistRepository } from '../../../repositories'

import { UseCase } from '@/modules/shared/types'
import { PublishingStatus } from '@/modules/backstage/enums'
import { BackstageArtistTable } from '@/modules/backstage/backstage.schema'

export interface CreateBackstageArtistUseCaseParams {
  readonly name: string
  readonly genres: string[]
  readonly verified: boolean
}

export type CreateBackstageArtistUseCaseResult = Selectable<BackstageArtistTable>

@Injectable()
export class CreateBackstageArtistUseCase implements UseCase<
  CreateBackstageArtistUseCaseParams,
  CreateBackstageArtistUseCaseResult
> {
  constructor(
    private readonly createBackstageArtistValidator: CreateBackstageArtistValidator,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async invoke(params: CreateBackstageArtistUseCaseParams): Promise<CreateBackstageArtistUseCaseResult> {
    await this.createBackstageArtistValidator.validate(params)

    return await this.artistRepository.createWithGenres({
      artist: {
        name: params.name,
        status: PublishingStatus.Draft,
        verified: params.verified,
      },
      genres: params.genres,
    })
  }
}
