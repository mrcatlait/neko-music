import { Injectable } from '@nestjs/common'

import { CreateAlbumCommand } from './create-album.command'
import { AlbumRepository } from '../../repositories'

import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class CreateAlbumValidator implements Validator<CreateAlbumCommand> {
  constructor(private readonly repository: AlbumRepository) {}

  async validate(command: CreateAlbumCommand): Promise<ValidationResult> {
    const albumExists = await this.repository.exists(command.name)

    if (albumExists) {
      return {
        isValid: false,
        errors: ['Album already exists'],
      }
    }

    return {
      isValid: true,
    }
  }
}
