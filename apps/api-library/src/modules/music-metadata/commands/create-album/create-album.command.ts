import { Command } from '@nestjs/cqrs'

import { AlbumType } from '../../enums'

import { AlbumEntity } from '@modules/music-metadata/entities'

export class CreateAlbumCommand extends Command<AlbumEntity> {
  constructor(
    readonly name: string,
    readonly releaseDate: Date,
    readonly explicit: boolean,
    readonly type: AlbumType,
    readonly genres: string[],
    readonly artists: string[],
  ) {
    super()
  }
}
