import { BadRequestException, Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { CreateBackstageArtistValidator } from './create-backstage-artist.validator'
import { ArtistRepository } from '../../../repositories'

import { UseCase } from '@/modules/shared/interfaces'
import { PublishingStatus } from '@/modules/backstage/enums'
import { BackstageArtistTable } from '@/modules/database'

export interface CreateBackstageArtistUseCaseParams {
  readonly userId: string
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
    const validationResult = await this.createBackstageArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return await this.artistRepository.createArtist({
      artist: {
        name: params.name,
        status: PublishingStatus.DRAFT,
        verified: params.verified,
        createdAt: new Date(),
        createdBy: params.userId,
        updatedAt: new Date(),
        updatedBy: params.userId,
      },
      genres: params.genres,
    })
  }
}
