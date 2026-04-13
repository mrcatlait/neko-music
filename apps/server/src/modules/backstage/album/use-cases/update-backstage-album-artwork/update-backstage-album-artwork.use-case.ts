import { Injectable } from '@nestjs/common'

import { AlbumRepository } from '../../repositories'
import { UpdateBackstageAlbumArtworkValidator } from './update-backstage-album-artwork.validator'
import { ProcessBackstageAlbumLifecycleUseCase } from '../process-backstage-album-lifecycle'
import { ProcessLinkedBackstageTracksUseCase } from '../process-linked-backstage-tracks'

import { UseCase } from '@/modules/shared/types'
import { EntityType } from '@/modules/media/enums'
import { GetArtworkUseCase } from '@/modules/media/use-cases'

export interface UpdateBackstageAlbumArtworkUseCaseParams {
  readonly id: string
}

export type UpdateBackstageAlbumArtworkUseCaseResult = void

@Injectable()
export class UpdateBackstageAlbumArtworkUseCase implements UseCase<
  UpdateBackstageAlbumArtworkUseCaseParams,
  UpdateBackstageAlbumArtworkUseCaseResult
> {
  constructor(
    private readonly updateBackstageAlbumArtworkValidator: UpdateBackstageAlbumArtworkValidator,
    private readonly albumRepository: AlbumRepository,
    private readonly getArtworkUseCase: GetArtworkUseCase,
    private readonly processBackstageAlbumLifecycleUseCase: ProcessBackstageAlbumLifecycleUseCase,
    private readonly processLinkedBackstageTracksUseCase: ProcessLinkedBackstageTracksUseCase,
  ) {}

  async invoke(params: UpdateBackstageAlbumArtworkUseCaseParams): Promise<UpdateBackstageAlbumArtworkUseCaseResult> {
    await this.updateBackstageAlbumArtworkValidator.validate(params)

    const artwork = await this.getArtworkUseCase.invoke({
      entityType: EntityType.Album,
      entityId: params.id,
    })

    await this.albumRepository.update(params.id, {
      artwork,
    })

    await this.processBackstageAlbumLifecycleUseCase.invoke({
      albumId: params.id,
    })

    await this.processLinkedBackstageTracksUseCase.invoke({ albumId: params.id })
  }
}
