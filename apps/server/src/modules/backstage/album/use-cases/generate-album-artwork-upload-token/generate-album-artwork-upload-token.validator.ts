import { BadRequestException, Injectable } from '@nestjs/common'

import { AlbumRepository } from '../../repositories'
import { GenerateAlbumArtworkUploadTokenUseCaseParams } from './generate-album-artwork-upload-token.use-case'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class GenerateAlbumArtworkUploadTokenValidator implements Validator<GenerateAlbumArtworkUploadTokenUseCaseParams> {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async validate(params: GenerateAlbumArtworkUploadTokenUseCaseParams): Promise<void> {
    const exists = await this.albumRepository.exists(params.albumId)

    if (!exists) {
      throw new BadRequestException('Album not found')
    }
  }
}
