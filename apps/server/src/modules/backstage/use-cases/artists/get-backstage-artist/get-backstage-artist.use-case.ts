import { Injectable, NotFoundException } from '@nestjs/common'

import { ArtistRepository } from '../../../repositories'

import { Artwork, UseCase } from '@/modules/shared/interfaces'
import { PublishingStatus } from '@/modules/backstage/enums'
import { GetArtworkUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

export interface GetBackstageArtistUseCaseParams {
  readonly artistId: string
}

export interface GetBackstageArtistUseCaseResult {
  readonly id: string
  readonly name: string
  readonly verified: boolean
  readonly status: PublishingStatus
  readonly genres: string[]
  readonly artwork: Artwork | null
}

@Injectable()
export class GetBackstageArtistUseCase implements UseCase<
  GetBackstageArtistUseCaseParams,
  GetBackstageArtistUseCaseResult
> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly getArtworkUseCase: GetArtworkUseCase,
  ) {}

  async invoke(params: GetBackstageArtistUseCaseParams): Promise<GetBackstageArtistUseCaseResult> {
    const artist = await this.artistRepository.findArtistWithGenresById(params.artistId)

    if (!artist) {
      throw new NotFoundException('Artist not found')
    }

    let artwork: Artwork | null = null

    try {
      artwork = await this.getArtworkUseCase.invoke({
        entityType: EntityType.ARTIST,
        entityId: params.artistId,
      })
    } catch {
      // artwork not yet uploaded — return null
    }

    return {
      id: artist.id,
      name: artist.name,
      verified: artist.verified,
      status: artist.status,
      genres: artist.genres,
      artwork,
    }
  }
}
