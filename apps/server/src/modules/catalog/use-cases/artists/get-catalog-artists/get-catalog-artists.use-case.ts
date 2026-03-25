import { Injectable } from '@nestjs/common'
import { Contracts } from '@neko/contracts'
import { Selectable } from 'kysely'

import { ArtistRepository } from '../../../repositories'

import { CatalogArtistTable } from '@/modules/catalog/catalog.schema'
import { PublishingStatus } from '@/modules/backstage/enums'
import { UseCase } from '@/modules/shared/types'

type CatalogArtistRow = Selectable<CatalogArtistTable> & { genres: string[] }

export type GetCatalogArtistsUseCaseResult = Array<Contracts.Backstage.Artists.Artist & { status: PublishingStatus }>

@Injectable()
export class GetCatalogArtistsUseCase implements UseCase<void, GetCatalogArtistsUseCaseResult> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async invoke(): Promise<GetCatalogArtistsUseCaseResult> {
    const rows: CatalogArtistRow[] = await this.artistRepository.findAllArtistsWithGenres()

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      verified: row.verified,
      status: PublishingStatus.Published,
      genres: row.genres,
      artwork: row.artwork,
    }))
  }
}
