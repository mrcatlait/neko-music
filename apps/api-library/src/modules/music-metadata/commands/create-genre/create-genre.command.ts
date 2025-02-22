import { Command } from '@nestjs/cqrs'

import { GenreEntity } from '@modules/music-metadata/entities'

export class CreateGenreCommand extends Command<GenreEntity> {
  constructor(readonly name: string) {
    super()
  }
}
