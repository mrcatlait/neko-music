import { BadRequestException, Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { AddArtistValidator } from './add-artist.validator'
import { ArtistRepository } from '../../../repositories'

import { UseCase } from '@/modules/shared/interfaces'
import { PublishingStatus } from '@/modules/backstage/enums'
import { BackstageArtistTable } from '@/modules/database'
import { SYSTEM_USER } from '@/modules/backstage/constants'

export interface AddArtistUseCaseParams {
  readonly name: string
  readonly genres: string[]
  readonly verified: boolean
}

export type AddArtistUseCaseResult = Selectable<BackstageArtistTable>

@Injectable()
export class AddArtistUseCase implements UseCase<AddArtistUseCaseParams, AddArtistUseCaseResult> {
  constructor(
    private readonly addArtistValidator: AddArtistValidator,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async invoke(params: AddArtistUseCaseParams): Promise<AddArtistUseCaseResult> {
    const validationResult = await this.addArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return await this.artistRepository.createArtist({
      artist: {
        name: params.name,
        status: PublishingStatus.DRAFT,
        verified: params.verified,
        createdAt: new Date(),
        createdBy: SYSTEM_USER,
        updatedAt: new Date(),
        updatedBy: SYSTEM_USER,
      },
      genres: params.genres,
    })
  }
}
