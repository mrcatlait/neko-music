import { BadRequestException, Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { AddArtistValidator } from './add-artist.validator'
import { ArtistRepository } from '../../../repositories'

import { ArtistTable } from '@/modules/database'
import { UseCase } from '@/modules/shared/interfaces'

export interface AddArtistUseCaseParams {
  readonly name: string
  readonly genres: string[]
  readonly verified: boolean
}

export type AddArtistUseCaseResult = Selectable<ArtistTable>

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
        // https://wanago.io/2023/10/09/api-nestjs-postgresql-kysely-json/
        artwork: {},
        published: false,
        verified: params.verified,
      },
      genres: params.genres,
    })
  }
}
