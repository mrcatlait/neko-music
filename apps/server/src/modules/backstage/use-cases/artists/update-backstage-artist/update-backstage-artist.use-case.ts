import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateBackstageArtistValidator } from './update-backstage-artist.validator'
import { ArtistRepository } from '../../../repositories'

import { UseCase } from '@/modules/shared/interfaces'
import { PublishingStatus } from '@/modules/backstage/enums'
import { UpdateCatalogArtistUseCase } from '@/modules/catalog/use-cases'
import { GetArtworkUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

export interface UpdateBackstageArtistUseCaseParams {
  readonly artistId: string
  readonly name: string
  readonly genres: string[]
}

@Injectable()
export class UpdateBackstageArtistUseCase implements UseCase<UpdateBackstageArtistUseCaseParams, void> {
  constructor(
    private readonly updateBackstageArtistValidator: UpdateBackstageArtistValidator,
    private readonly artistRepository: ArtistRepository,
    private readonly updateCatalogArtistUseCase: UpdateCatalogArtistUseCase,
    private readonly getArtworkUseCase: GetArtworkUseCase,
  ) {}

  async invoke(params: UpdateBackstageArtistUseCaseParams): Promise<void> {
    const validationResult = await this.updateBackstageArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const artist = await this.artistRepository.findArtistWithGenresById(params.artistId)
    if (!artist) {
      throw new BadRequestException(['Artist not found'])
    }

    await this.artistRepository.updateArtist({
      artistId: params.artistId,
      name: params.name,
      genres: params.genres,
    })

    if (artist.status === PublishingStatus.PUBLISHED && artist.catalogArtistId) {
      const artwork = await this.getArtworkUseCase.invoke({
        entityType: EntityType.ARTIST,
        entityId: params.artistId,
      })

      await this.updateCatalogArtistUseCase.invoke({
        catalogArtistId: artist.catalogArtistId,
        name: params.name,
        genres: params.genres,
        verified: artist.verified,
        artwork,
      })
    }
  }
}
