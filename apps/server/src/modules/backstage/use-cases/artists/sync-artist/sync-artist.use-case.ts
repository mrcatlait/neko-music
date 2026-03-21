import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { ArtistRepository } from '../../../repositories'
import { SyncArtistValidator } from './sync-artist.validator'

import { UseCase } from '@/modules/shared/types'
import { EntityType } from '@/modules/media/enums'
import { GetArtworkUseCase } from '@/modules/media/use-cases'
import { CreateCatalogArtistUseCase, UpdateCatalogArtistUseCase } from '@/modules/catalog/use-cases'
import { PublishingStatus } from '@/modules/backstage/enums'
import { CatalogArtistTable } from '@/modules/catalog/catalog.schema'

export interface SyncArtistUseCaseParams {
  readonly artistId: string
}

export type SyncArtistUseCaseResult = Selectable<CatalogArtistTable>

@Injectable()
export class SyncArtistUseCase implements UseCase<SyncArtistUseCaseParams, SyncArtistUseCaseResult> {
  constructor(
    private readonly syncArtistValidator: SyncArtistValidator,
    private readonly getArtworkUseCase: GetArtworkUseCase,
    private readonly artistRepository: ArtistRepository,
    private readonly updateCatalogArtistUseCase: UpdateCatalogArtistUseCase,
    private readonly createCatalogArtistUseCase: CreateCatalogArtistUseCase,
  ) {}

  async invoke(params: SyncArtistUseCaseParams): Promise<SyncArtistUseCaseResult> {
    await this.syncArtistValidator.validate(params)

    const artist = await this.artistRepository.findOneWithGenres(params.artistId)

    if (!artist) {
      throw new Error('Artist not found')
    }

    const artwork = await this.getArtworkUseCase.invoke({
      entityType: EntityType.Artist,
      entityId: params.artistId,
    })

    if (artist.status === PublishingStatus.Published) {
      if (!artist.catalogArtistId) {
        throw new Error('Artist is published but does not have a catalog artist id')
      }

      return this.updateCatalogArtistUseCase.invoke({
        id: artist.catalogArtistId,
        name: artist.name,
        genres: artist.genres,
        verified: artist.verified,
        artwork,
      })
    }

    const catalogArtist = await this.createCatalogArtistUseCase.invoke({
      name: artist.name,
      genres: artist.genres,
      verified: artist.verified,
      artwork,
    })

    await this.artistRepository.update(artist.id, {
      catalogArtistId: catalogArtist.id,
      status: PublishingStatus.Published,
    })

    return catalogArtist
  }
}
