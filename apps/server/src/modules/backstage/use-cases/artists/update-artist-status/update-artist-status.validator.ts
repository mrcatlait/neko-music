import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateArtistStatusUseCaseParams } from './update-artist-status.use-case'
import { ArtistRepository } from '../../../repositories'

import { Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UpdateArtistStatusValidator implements Validator<UpdateArtistStatusUseCaseParams> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async validate(params: UpdateArtistStatusUseCaseParams): Promise<void> {
    const artist = await this.artistRepository.findArtistById(params.artistId)

    if (!artist) {
      throw new BadRequestException(`Artist ${params.artistId} not found`)
    }
  }
}
