import { Injectable } from '@nestjs/common'

import { GenerateTrackAudioUploadTokenValidator } from './generate-track-audio-upload-token.validator'

import { EntityType, MediaType } from '@/modules/media/enums'
import { GenerateUploadTokenUseCase, GenerateUploadTokenUseCaseResult } from '@/modules/media/use-cases'
import { UseCase } from '@/modules/shared/types'

export interface GenerateTrackAudioUploadTokenUseCaseParams {
  readonly trackId: string
  readonly userId: string
}

@Injectable()
export class GenerateTrackAudioUploadTokenUseCase implements UseCase<
  GenerateTrackAudioUploadTokenUseCaseParams,
  GenerateUploadTokenUseCaseResult
> {
  constructor(
    private readonly generateTrackAudioUploadTokenValidator: GenerateTrackAudioUploadTokenValidator,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
  ) {}

  async invoke(params: GenerateTrackAudioUploadTokenUseCaseParams): Promise<GenerateUploadTokenUseCaseResult> {
    await this.generateTrackAudioUploadTokenValidator.validate(params)

    return this.generateUploadTokenUseCase.invoke({
      userId: params.userId,
      mediaType: MediaType.Audio,
      entityType: EntityType.Track,
      entityId: params.trackId,
    })
  }
}
