import { Command } from '@nestjs/cqrs'

import { MediaType, EntityType } from '@modules/media/enums'

export class GenerateUploadTokenCommand extends Command<{ token: string }> {
  constructor(
    readonly userId: string,
    readonly entityId: string,
    readonly entityType: EntityType,
    readonly mediaType: MediaType,
  ) {
    super()
  }
}
