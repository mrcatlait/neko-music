import { TrackRepository } from '../repositories'

import { Validator, ValidationResult } from '@core/validation'

export class TrackExistenceValidator implements Validator<string> {
  constructor(private readonly trackRepository: TrackRepository) {}

  async validate(trackId: string): Promise<ValidationResult> {
    const exists = await this.trackRepository.exists(trackId)

    return {
      isValid: exists,
      errors: exists ? [] : [`Track ${trackId} does not exist`],
    }
  }
}
