import { Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../repositories'
import { UpdateCatalogArtistUseCaseParams } from './update-catalog-artist.use-case'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class UpdateCatalogArtistValidator implements Validator<UpdateCatalogArtistUseCaseParams> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async validate(params: UpdateCatalogArtistUseCaseParams): Promise<void> {
    await this.artistRepository.exists(params.id)
  }
}
