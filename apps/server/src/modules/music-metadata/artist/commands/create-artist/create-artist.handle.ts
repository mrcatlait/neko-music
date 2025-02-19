import { BadRequestException, Injectable } from '@nestjs/common'

import { CommandHandler } from '@modules/shared/models'

import { CreateArtistCommand } from './create-artist.command'
import { CreateArtistValidator } from './create-artist.validator'
import { CreateArtistSaga } from '../../sagas'

@Injectable()
export class CreateArtistHandler implements CommandHandler<CreateArtistCommand, void> {
  constructor(
    private readonly createArtistValidator: CreateArtistValidator,
    private readonly createArtistSaga: CreateArtistSaga,
  ) {}

  async handle(command: CreateArtistCommand): Promise<void> {
    const validationResult = await this.createArtistValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    await this.createArtistSaga.execute({
      name: command.name,
      verified: command.verified,
      genres: command.genres,
      shortText: command.shortText,
      standardText: command.standardText,
    })
  }
}
