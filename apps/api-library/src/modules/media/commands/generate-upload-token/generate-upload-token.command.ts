import { Command } from '@nestjs/cqrs'

import { MediaType } from '@modules/media/enums'

export class GenerateUploadTokenCommand extends Command<{ uploadToken: string }> {
  constructor(
    readonly userId: string,
    readonly mediaType: MediaType,
  ) {
    super()
  }
}
