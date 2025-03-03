import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { randomUUID } from 'crypto'
import { join } from 'path'
import { mkdirSync, existsSync } from 'fs'

import { UploadMediaCommand } from './upload-media.command'
import { UploadMediaValidator } from './upload-media.validator'

import { UploadTokenRepository } from '@modules/media/repositories'
import { FileUploadService } from '@modules/media/services'
import { UPLOAD_PATH } from '@modules/media/constants'

@CommandHandler(UploadMediaCommand)
export class UploadMediaHandler implements ICommandHandler<UploadMediaCommand> {
  constructor(
    private readonly uploadMediaValidator: UploadMediaValidator,
    private readonly uploadTokenRepository: UploadTokenRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async execute(command: UploadMediaCommand): Promise<void> {
    const validationResult = await this.uploadMediaValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    // const fileHash = createHash('sha256').update(command.file.buffer).digest('hex')

    const uploadToken = await this.uploadTokenRepository.findOne(command.token)

    if (!uploadToken) {
      throw new ForbiddenException(['Upload token not found'])
    }

    const fileExtension = command.file.originalname.split('.').pop()
    const uniqueFilename = `${randomUUID()}.${fileExtension}`
    const filePath = join(UPLOAD_PATH, uniqueFilename)

    if (!existsSync(UPLOAD_PATH)) {
      mkdirSync(UPLOAD_PATH, { recursive: true })
    }

    this.fileUploadService.uploadFile(filePath, command.file.buffer!)

    await this.uploadTokenRepository.delete(command.token)
  }
}
