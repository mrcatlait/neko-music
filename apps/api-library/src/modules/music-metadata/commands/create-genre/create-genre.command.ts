import { Command } from '@nestjs/cqrs'

import { GenreEntity } from '../../entities'

export class CreateGenreCommand extends Command<GenreEntity> {
  constructor(readonly name: string) {
    super()
  }
}
