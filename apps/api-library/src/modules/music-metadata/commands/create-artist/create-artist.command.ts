import { Command } from '@nestjs/cqrs'

export class CreateArtistCommand extends Command<void> {
  constructor(
    readonly name: string,
    readonly verified: boolean,
    readonly genres: string[],
    readonly shortText: string,
    readonly standardText: string,
  ) {
    super()
  }
}
