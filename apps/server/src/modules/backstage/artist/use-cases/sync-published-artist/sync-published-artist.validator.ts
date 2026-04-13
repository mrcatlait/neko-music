import { BadRequestException, Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'
import { SyncPublishedArtistUseCaseParams } from './sync-published-artist.use-case'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class SyncPublishedArtistValidator implements Validator<SyncPublishedArtistUseCaseParams> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async validate(params: SyncPublishedArtistUseCaseParams): Promise<void> {
    const artist = await this.artistRepository.findOne(params.artistId)

    if (!artist) {
      throw new BadRequestException(`Artist ${params.artistId} not found`)
    }

    if (artist.status !== PublishingStatus.Published) {
      throw new BadRequestException('Artist is not published')
    }
  }
}
