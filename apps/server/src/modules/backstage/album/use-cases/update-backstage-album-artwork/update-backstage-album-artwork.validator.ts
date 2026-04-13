import { BadRequestException, Injectable } from '@nestjs/common'

import { AlbumRepository } from '../../repositories'
import { UpdateBackstageAlbumArtworkUseCaseParams } from './update-backstage-album-artwork.use-case'

import { Validator } from '@/modules/shared/types'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

@Injectable()
export class UpdateBackstageAlbumArtworkValidator implements Validator<UpdateBackstageAlbumArtworkUseCaseParams> {
  constructor(
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
    private readonly albumRepository: AlbumRepository,
  ) {}

  async validate(params: UpdateBackstageAlbumArtworkUseCaseParams): Promise<void> {
    const mediaReadiness = await this.getMediaReadinessUseCase.invoke({
      entityType: EntityType.Album,
      entityId: params.id,
    })

    if (!mediaReadiness.ready) {
      throw new BadRequestException('Media file is not ready')
    }

    const album = await this.albumRepository.findOne(params.id)

    if (!album) {
      throw new BadRequestException('Album not found')
    }
  }
}
