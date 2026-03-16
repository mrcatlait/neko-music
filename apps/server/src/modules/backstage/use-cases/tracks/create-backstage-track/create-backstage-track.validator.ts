import { Injectable } from '@nestjs/common'

import { CreateBackstageTrackUseCaseParams } from './create-backstage-track.use-case'
import { GenreRepository } from '../../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class CreateBackstageTrackValidator implements Validator<CreateBackstageTrackUseCaseParams> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(params: CreateBackstageTrackUseCaseParams): Promise<ValidationResult> {
    const [genresExist] = await Promise.all([this.genreRepository.findGenresByIds(params.genres)])

    if (genresExist.length !== params.genres.length) {
      return { isValid: false, error: 'Genres not found' }
    }

    return { isValid: true }
  }
}
