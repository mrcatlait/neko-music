import { Command } from '@nestjs/cqrs'

import { EntityType, MediaType } from '../../enums'

export class GenerateUploadTokenCommand extends Command<{ uploadToken: string }> {
  constructor(
    readonly userId: string,
    readonly mediaType: MediaType,
    readonly entityType: EntityType,
    readonly entityId: string,
  ) {
    super()
  }
}
