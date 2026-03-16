import { Injectable } from '@nestjs/common'

import { CreateBackstageAlbumUseCaseParams } from './create-backstage-album.use-case'
import { AlbumRepository, GenreRepository } from '../../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class CreateBackstageAlbumValidator implements Validator<CreateBackstageAlbumUseCaseParams> {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: CreateBackstageAlbumUseCaseParams): Promise<ValidationResult> {
    const [nameTaken, genresExist] = await Promise.all([
      this.albumRepository.findAlbumByName(params.name),
      this.genreRepository.findGenresByIds(params.genres),
    ])

    if (nameTaken) {
      return {
        isValid: false,
        error: 'Album name already taken',
      }
    }

    if (genresExist.length !== params.genres.length) {
      return {
        isValid: false,
        error: 'Genres not found',
      }
    }

    /**
     * @todo Validate artist IDs
     */

    return { isValid: true }
  }
}
