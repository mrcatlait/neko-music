import { Inject, Injectable } from '@nestjs/common'

import { EntityType } from '../../enums'
import { MediaRepository } from '../../repositories'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaModuleOptions } from '../../types'
import { NamingStrategy } from '../../strategies'

import { Artwork, UseCase } from '@/modules/shared/interfaces'

export interface GetArtworkUseCaseParams {
  readonly entityType: EntityType
  readonly entityId: string
}

export type GetArtworkUseCaseResult = Artwork

@Injectable()
export class GetArtworkUseCase implements UseCase<GetArtworkUseCaseParams, GetArtworkUseCaseResult> {
  private readonly namingStrategy: NamingStrategy

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly mediaRepository: MediaRepository,
  ) {
    this.namingStrategy = options.namingStrategy
  }

  async invoke(params: GetArtworkUseCaseParams): Promise<GetArtworkUseCaseResult> {
    const assets = await this.mediaRepository.findImageAssetsByEntityTypeAndEntityId(params.entityType, params.entityId)

    if (assets.length === 0) {
      throw new Error(`No artwork found for ${params.entityType} ${params.entityId}`)
    }

    const uniqueFormats = [...new Set(assets.map((asset) => asset.asset.format))]

    if (uniqueFormats.length > 1) {
      throw new Error(`Multiple formats found for ${params.entityType} ${params.entityId}`)
    }

    const format = uniqueFormats[0]

    const url = this.namingStrategy.generateArtworkFilenameTemplate(params.entityId, format)

    const uniqueDominantColors = [...new Set(assets.map((asset) => asset.metadata.dominantColor))]

    if (uniqueDominantColors.length > 1) {
      throw new Error(`Multiple dominant colors found for ${params.entityType} ${params.entityId}`)
    }

    const dominantColor = uniqueDominantColors[0]

    return {
      url,
      dominantColor,
    }
  }
}
