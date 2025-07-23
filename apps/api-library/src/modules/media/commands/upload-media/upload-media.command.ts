import { File } from '@nest-lab/fastify-multer'
import { Command } from '@nestjs/cqrs'

export class UploadMediaCommand extends Command<void> {
  constructor(
    readonly file: File,
    readonly userId: string,
    readonly token: string,
  ) {
    super()
  }
}
