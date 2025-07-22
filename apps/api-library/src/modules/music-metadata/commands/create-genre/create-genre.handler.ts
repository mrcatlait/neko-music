import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BadRequestException } from '@nestjs/common'

import { CreateGenreCommand } from './create-genre.command'
import { CreateGenreValidator } from './create-genre.validator'
import { GenreRepository } from '../../repositories'
import { GenreEntity } from '../../entities'

@CommandHandler(CreateGenreCommand)
export class CreateGenreHandler implements ICommandHandler<CreateGenreCommand, void> {
  constructor(
    private readonly createGenreValidator: CreateGenreValidator,
    private readonly genreRepository: GenreRepository,
  ) {}

  async execute(command: CreateGenreCommand): Promise<GenreEntity> {
    const validationResult = await this.createGenreValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.genreRepository.create({
      name: command.name,
    })
  }
}
