import { BadRequestException, Injectable } from '@nestjs/common'

import { PublishArtistValidator } from './publish-artist.validator'

import { UseCase } from '@/modules/shared/interfaces'
import { ArtistRepository } from '@/modules/backstage/repositories'
import { CreateCatalogArtistUseCase } from '@/modules/catalog/use-cases'
import { GetArtworkUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

export interface PublishArtistUseCaseParams {
  readonly userId: string
  readonly artistId: string
}

export type PublishArtistUseCaseResult = void

@Injectable()
export class PublishArtistUseCase implements UseCase<PublishArtistUseCaseParams, PublishArtistUseCaseResult> {
  constructor(
    private readonly publishArtistValidator: PublishArtistValidator,
    private readonly artistRepository: ArtistRepository,
    private readonly createCatalogArtistUseCase: CreateCatalogArtistUseCase,
    private readonly getArtworkUseCase: GetArtworkUseCase,
  ) {}

  async invoke(params: PublishArtistUseCaseParams): Promise<PublishArtistUseCaseResult> {
    const validationResult = await this.publishArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const artist = await this.artistRepository.findArtistWithGenresById(params.artistId)
    if (!artist) {
      throw new BadRequestException(['Artist not found'])
    }

    const artwork = await this.getArtworkUseCase.invoke({
      entityType: EntityType.ARTIST,
      entityId: params.artistId,
    })

    const catalogArtist = await this.createCatalogArtistUseCase.invoke({
      name: artist.name,
      genres: artist.genres,
      verified: artist.verified,
      artwork,
    })

    await this.artistRepository.publishArtist(params.artistId, catalogArtist.id, params.userId)
  }
}
