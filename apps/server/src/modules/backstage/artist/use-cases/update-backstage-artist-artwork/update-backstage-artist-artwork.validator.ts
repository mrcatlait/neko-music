import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateBackstageArtistArtworkUseCaseParams } from './update-backstage-artist-artwork.use-case'
import { ArtistRepository } from '../../repositories'

import { Validator } from '@/modules/shared/types'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

@Injectable()
export class UpdateBackstageArtistArtworkValidator implements Validator<UpdateBackstageArtistArtworkUseCaseParams> {
  constructor(
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async validate(params: UpdateBackstageArtistArtworkUseCaseParams): Promise<void> {
    const mediaReadiness = await this.getMediaReadinessUseCase.invoke({
      entityType: EntityType.Artist,
      entityId: params.id,
    })

    if (!mediaReadiness.ready) {
      throw new BadRequestException('Media file is not ready')
    }

    const artist = await this.artistRepository.findOne(params.id)

    if (!artist) {
      throw new BadRequestException('Artist not found')
    }
  }
}
