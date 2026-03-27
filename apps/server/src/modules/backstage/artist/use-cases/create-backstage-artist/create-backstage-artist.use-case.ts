import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { CreateBackstageArtistValidator } from './create-backstage-artist.validator'
import { ArtistRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'
import { BackstageArtistTable } from '../../../backstage.schema'

import { UseCase } from '@/modules/shared/types'

export interface CreateBackstageArtistUseCaseParams {
  readonly name: string
  readonly genres: string[]
  readonly verified: boolean
  readonly userId: string
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

    return this.artistRepository.createWithGenres({
      name: params.name,
      status: PublishingStatus.Draft,
      verified: params.verified,
      createdBy: params.userId,
      updatedBy: params.userId,
      genres: params.genres,
    })
  }
}
