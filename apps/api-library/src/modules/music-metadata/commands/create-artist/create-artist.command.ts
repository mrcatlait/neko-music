import { Command } from '@nestjs/cqrs'

import { ArtistEntity } from '../../entities'

export class CreateArtistCommand extends Command<ArtistEntity> {
  constructor(
    readonly name: string,
    readonly verified: boolean,
    readonly genres: string[],
  ) {
    super()
  }
}
