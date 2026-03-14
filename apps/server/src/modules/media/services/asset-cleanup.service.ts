import { Inject, Injectable } from '@nestjs/common'

import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { MediaModuleOptions } from '../types'
import { StorageStrategy } from '../strategies'
import {
  AssetRepository,
  AudioMetadataRepository,
  ImageMetadataRepository,
  SourceAssetRepository,
} from '../repositories'
import { EntityType, MediaType } from '../enums'

@Injectable()
export class AssetCleanupService {
  private readonly storageStrategy: StorageStrategy

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly sourceAssetRepository: SourceAssetRepository,
    private readonly assetRepository: AssetRepository,
    private readonly imageMetadataRepository: ImageMetadataRepository,
    private readonly audioMetadataRepository: AudioMetadataRepository,
  ) {
    this.storageStrategy = options.storageStrategy
  }

  /**
   * Cleans up a source asset and its associated assets.
   * @param sourceAssetId - The ID of the source asset to cleanup.
   */
  async cleanupSourceAsset(sourceAssetId: string): Promise<void> {
    const sourceAsset = await this.sourceAssetRepository.findById(sourceAssetId)

    if (!sourceAsset) {
      throw new Error(`Source asset with id "${sourceAssetId}" not found`)
    }

    const assets = await this.assetRepository.findBySourceAssetId(sourceAsset.id)

    for (const asset of assets) {
      await this.cleanupAsset(asset.id)
    }

    await this.storageStrategy.delete(sourceAsset.storagePath)
    await this.sourceAssetRepository.deleteById(sourceAsset.id)
  }

  /**
   * Cleans up an asset and its associated metadata.
   * @param assetId - The ID of the asset to cleanup.
   */
  async cleanupAsset(assetId: string): Promise<void> {
    const asset = await this.assetRepository.findById(assetId)

    if (!asset) {
      throw new Error(`Asset with id "${assetId}" not found`)
    }

    switch (asset.mediaType) {
      case MediaType.Image:
        await this.imageMetadataRepository.deleteByAssetId(asset.id)
        break
      case MediaType.Audio:
        await this.audioMetadataRepository.deleteByAssetId(asset.id)
        break
    }

    await this.storageStrategy.delete(asset.storagePath)
    await this.assetRepository.deleteById(asset.id)
  }

  /**
   * Cleans up all source assets for an entity, except for the one with the given ID
   * @param entityType - The type of the entity.
   * @param entityId - The ID of the entity.
   * @param excludeSourceAssetId - The ID of the source asset to exclude.
   */
  async cleanupSourceAssetsForEntity(
    entityType: EntityType,
    entityId: string,
    excludeSourceAssetId: string,
  ): Promise<void> {
    const sourceAssets = await this.sourceAssetRepository.findAllByEntityTypeAndEntityId(entityType, entityId)

    const oldSourceAssets = sourceAssets.filter((sourceAsset) => sourceAsset.id !== excludeSourceAssetId)

    for (const sourceAsset of oldSourceAssets) {
      await this.cleanupSourceAsset(sourceAsset.id)
    }
  }
}
