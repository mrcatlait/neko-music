import { Command } from '@nestjs/cqrs'

import { AlbumType } from '../../enums'
import { ArtworkEntity } from '../../entities'

export class CreateAlbumCommand extends Command<void> {
  constructor(
    readonly name: string,
    readonly releaseDate: Date,
    readonly explicit: boolean,
    readonly type: AlbumType,
    readonly artwork: ArtworkEntity,
    readonly mediaFileId: string,
    readonly genres: string[],
    readonly artists: string[],
  ) {
    super()
  }
}
