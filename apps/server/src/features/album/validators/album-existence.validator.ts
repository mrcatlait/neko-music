import { AlbumRepository } from '../repositories'

import { Validator, ValidationResult } from '@core/validation'

export class AlbumExistenceValidator implements Validator<string> {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async validate(albumId: string): Promise<ValidationResult> {
    const exists = await this.albumRepository.exists(albumId)

    return {
      isValid: exists,
      errors: exists ? [] : [`Album ${albumId} does not exist`],
    }
  }
}
