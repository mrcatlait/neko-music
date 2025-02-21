import { ForbiddenException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { randomUUID } from 'crypto'
import { join } from 'path'

import { UploadMediaCommand } from './upload-media.command'
import { UploadMediaValidator } from './upload-media.validator'

import { ProcessingMediaRepository, UploadTokenRepository } from '@modules/media/repositories'
import { FileUploadService } from '@modules/media/services'
import { UPLOAD_PATH } from '@modules/media/constants'
import { ProcessingStatus } from '@modules/media/enums'

@CommandHandler(UploadMediaCommand)
export class UploadMediaHandler implements ICommandHandler<UploadMediaCommand> {
  constructor(
    private readonly uploadMediaValidator: UploadMediaValidator,
    private readonly uploadTokenRepository: UploadTokenRepository,
    private readonly fileUploadService: FileUploadService,
    private readonly processingMediaRepository: ProcessingMediaRepository,
  ) {}

  async execute(command: UploadMediaCommand): Promise<void> {
    const validationResult = await this.uploadMediaValidator.validate(command)

    if (!validationResult.isValid) {
      throw new ForbiddenException(validationResult.errors)
    }

    const uploadToken = await this.uploadTokenRepository.getById(command.token)

    if (!uploadToken) {
      throw new ForbiddenException(['Upload token not found'])
    }

    const fileExtension = command.file.originalname.split('.').pop()
    const uniqueFilename = `${randomUUID()}.${fileExtension}`
    const filePath = join(UPLOAD_PATH, uniqueFilename)

    this.fileUploadService.uploadFile(filePath, command.file.buffer!)

    try {
      await this.processingMediaRepository.create({
        entity_type: uploadToken.entity_type,
        entity_id: uploadToken.entity_id,
        user_id: command.userId,
        media_type: uploadToken.media_type,
        file_path: filePath,
        status: ProcessingStatus.PENDING,
      })
    } catch (error) {
      this.fileUploadService.deleteFile(filePath)
      throw error
    }
  }
}
