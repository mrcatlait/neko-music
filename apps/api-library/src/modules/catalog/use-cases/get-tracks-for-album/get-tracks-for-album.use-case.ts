import { Injectable } from '@nestjs/common'

import { TrackWithAlbumAndArtistsEntity } from '../../entities'
import { TrackRepository } from '../../repositories'

export interface GetTracksForAlbumUseCaseParams {
  readonly id: string
}

@Injectable()
export class GetTracksForAlbumUseCase {
  constructor(private readonly repository: TrackRepository) {}

  async invoke(params: GetTracksForAlbumUseCaseParams): Promise<TrackWithAlbumAndArtistsEntity[]> {
    return this.repository.findByAlbumId(params.id)
  }
}
