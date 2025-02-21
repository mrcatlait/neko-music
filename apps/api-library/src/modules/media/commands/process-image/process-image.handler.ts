import { BadRequestException, Injectable } from '@nestjs/common'

import { Handler } from '@modules/shared/models'
import { ImageProcessingService } from '@modules/media/shared/services'

import { ProcessImageCommand } from './process-image.command'
import { ProcessingMediaRepository } from '@modules/media/shared/repositories'
import { ProcessImageValidator } from './process-image.validator'
import { GetProcessingMediaHandler } from '../../queries'
import { join } from 'path'
import { MEDIA_PATH } from '@modules/streaming/constants'

@Injectable()
export class ProcessImageHandler implements Handler<ProcessImageCommand> {
  constructor(
    private readonly processImageValidator: ProcessImageValidator,
    private readonly getProcessingMediaHandler: GetProcessingMediaHandler,
    private readonly imageProcessingService: ImageProcessingService,
    private readonly processingMediaRepository: ProcessingMediaRepository,
  ) {}

  async handle(command: ProcessImageCommand): Promise<void> {
    const validationResult = await this.processImageValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const processingMedia = await this.getProcessingMediaHandler.handle({
      processingMediaId: command.processingMediaId,
    })

    const targetFolderPath = join(MEDIA_PATH, processingMedia.entity_type, processingMedia.entity_id)

    const processingResult = await this.imageProcessingService.processImage({
      sourcePath: processingMedia.file_path,
      targetFolderPath,
    })
  }
}
