import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateArtistStatusUseCaseParams } from './update-artist-status.use-case'
import { ArtistRepository } from '../../repositories'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class UpdateArtistStatusValidator implements Validator<UpdateArtistStatusUseCaseParams> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async validate(params: UpdateArtistStatusUseCaseParams): Promise<void> {
    const exists = await this.artistRepository.exists(params.artistId)

    if (!exists) {
      throw new BadRequestException(`Artist ${params.artistId} not found`)
    }
  }
}
