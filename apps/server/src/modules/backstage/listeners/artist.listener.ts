import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { PublishArtistUseCase, UpdateArtistStatusUseCase } from '../use-cases'
import { ArtistRepository } from '../repositories'
import { PublishingStatus } from '../enums'

import { MediaProcessingFailedEvent, MediaProcessingStartedEvent, MediaReadyEvent } from '@/modules/shared/events'
import { EntityType } from '@/modules/media/enums'
import { GetArtworkUseCase } from '@/modules/media/use-cases'
import { UpdateCatalogArtistUseCase } from '@/modules/catalog/use-cases'

@Injectable()
export class ArtistListener {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly updateArtistStatusUseCase: UpdateArtistStatusUseCase,
    private readonly publishArtistUseCase: PublishArtistUseCase,
    private readonly updateCatalogArtistUseCase: UpdateCatalogArtistUseCase,
    private readonly getArtworkUseCase: GetArtworkUseCase,
  ) {}

  @OnEvent(MediaProcessingStartedEvent.event)
  handleMediaProcessingStartedEvent({ payload }: MediaProcessingStartedEvent): Promise<void> | void {
    if (payload.entityType !== EntityType.Artist) return

    return this.updateArtistStatusUseCase.invoke({
      artistId: payload.entityId,
      status: PublishingStatus.PROCESSING,
    })
  }

  @OnEvent(MediaReadyEvent.event)
  async handleMediaReadyEvent({ payload }: MediaReadyEvent): Promise<void> {
    if (payload.entityType !== EntityType.Artist) return

    const artist = await this.artistRepository.findArtistWithGenresById(payload.entityId)
    if (!artist) return

    if (artist.catalogArtistId) {
      const artwork = await this.getArtworkUseCase.invoke({
        entityType: EntityType.Artist,
        entityId: payload.entityId,
      })

      await this.updateCatalogArtistUseCase.invoke({
        id: artist.catalogArtistId,
        name: artist.name,
        genres: artist.genres,
        verified: artist.verified,
        artwork,
      })

      await this.updateArtistStatusUseCase.invoke({
        artistId: payload.entityId,
        status: PublishingStatus.PUBLISHED,
      })
    } else {
      await this.publishArtistUseCase.invoke({
        artistId: payload.entityId,
      })
    }
  }

  @OnEvent(MediaProcessingFailedEvent.event)
  handleMediaProcessingFailedEvent({ payload }: MediaProcessingFailedEvent): Promise<void> | void {
    if (payload.entityType !== EntityType.Artist) return

    return this.updateArtistStatusUseCase.invoke({
      artistId: payload.entityId,
      status: PublishingStatus.DRAFT,
    })
  }
}
