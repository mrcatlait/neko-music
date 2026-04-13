import { BadRequestException, Injectable } from '@nestjs/common'

import { TrackRepository } from '../../repositories'
import { GenerateTrackAudioUploadTokenUseCaseParams } from './generate-track-audio-upload-token.use-case'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class GenerateTrackAudioUploadTokenValidator implements Validator<GenerateTrackAudioUploadTokenUseCaseParams> {
  constructor(private readonly trackRepository: TrackRepository) {}

  async validate(params: GenerateTrackAudioUploadTokenUseCaseParams): Promise<void> {
    const exists = await this.trackRepository.exists(params.trackId)

    if (!exists) {
      throw new BadRequestException('Track not found')
    }
  }
}
