import { Injectable, NotFoundException } from '@nestjs/common'

import { ArtistEntity } from '../../entities'
import { ArtistRepository } from '../../repositories'

export interface GetArtistUseCaseParams {
  readonly id: string
}

@Injectable()
export class GetArtistUseCase {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async invoke(params: GetArtistUseCaseParams): Promise<ArtistEntity> {
    const artist = await this.artistRepository.find(params.id)

    if (!artist) {
      throw new NotFoundException('Artist not found')
    }

    return artist
  }
}
