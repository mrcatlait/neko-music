import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { ArtistRepository } from '../../repositories'
import { SyncArtistValidator } from './sync-artist.validator'
import { PublishingStatus } from '../../../shared/enums'
import { GetBackstageArtistUseCase } from '../get-backstage-artist'

import { UseCase } from '@/modules/shared/types'
import { BackstageArtistTable } from '@/modules/backstage/backstage.schema'

export interface SyncArtistUseCaseParams {
  readonly artistId: string
}

export type SyncArtistUseCaseResult = Selectable<BackstageArtistTable>

@Injectable()
export class SyncArtistUseCase implements UseCase<SyncArtistUseCaseParams, SyncArtistUseCaseResult> {
  constructor(
    private readonly syncArtistValidator: SyncArtistValidator,
    private readonly artistRepository: ArtistRepository,
    private readonly getBackstageArtistUseCase: GetBackstageArtistUseCase,
  ) {}

  async invoke(params: SyncArtistUseCaseParams): Promise<SyncArtistUseCaseResult> {
    await this.syncArtistValidator.validate(params)

    const artist = await this.getBackstageArtistUseCase.invoke({ id: params.artistId })

    if (artist.status !== PublishingStatus.Published) {
      await this.artistRepository.update(artist.id, {
        status: PublishingStatus.Published,
      })
    }

    // if (artist.status === PublishingStatus.Published) {
    //   return this.updateCatalogArtistUseCase.invoke({
    //     id: artist.catalogArtistId,
    //     name: artist.name,
    //     genres: artist.genres,
    //     verified: artist.verified,
    //     artwork,
    //   })
    // }

    return artist
  }
}
