import { Injectable } from '@nestjs/common'

import { EntityType, MediaType } from '../../enums'
import { AssetRepository, AudioMetadataRepository } from '../../repositories'

import { Playback, UseCase } from '@/modules/shared/types'

export interface GetPlaybackUseCaseParams {
  readonly entityType: EntityType
  readonly entityId: string
}

export type GetPlaybackUseCaseResult = Playback

@Injectable()
export class GetPlaybackUseCase implements UseCase<GetPlaybackUseCaseParams, GetPlaybackUseCaseResult> {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly audioMetadataRepository: AudioMetadataRepository,
  ) {}

  async invoke(params: GetPlaybackUseCaseParams): Promise<GetPlaybackUseCaseResult> {
    const audioAssets = await this.assetRepository.findMany({
      entityType: params.entityType,
      entityId: params.entityId,
      mediaType: MediaType.Audio,
    })

    if (audioAssets.length === 0) {
      throw new Error(`No audio asset found for ${params.entityType} ${params.entityId}`)
    }

    if (audioAssets.length > 1) {
      throw new Error(`Multiple audio assets found for ${params.entityType} ${params.entityId}`)
    }

    const audioMetadata = await this.audioMetadataRepository.findOne({
      assetId: audioAssets[0].id,
    })

    if (!audioMetadata) {
      throw new Error(`No audio metadata found for ${params.entityType} ${params.entityId}`)
    }

    return {
      url: audioAssets[0].storagePath,
      format: audioAssets[0].format,
      duration: audioMetadata.duration,
    }
  }
}
