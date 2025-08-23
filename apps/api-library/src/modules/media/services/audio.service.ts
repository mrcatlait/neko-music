import { Inject, Injectable, Logger } from '@nestjs/common'
import { join } from 'path'

import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { MediaModuleOptions } from '../types'
import { AudioTransformParameters, AudioTransformStrategy, NamingStrategy, StorageStrategy } from '../strategies'
import { MediaAssetRepository, MediaAudioMetadataRepository, MediaSourceRepository } from '../repositories'
import { FileUtilsService } from './file-utils.service'
import { MediaType } from '../enums'
import { DashUtilsService } from './dash-utils.service'

import { DatabaseService } from '@/modules/database'

/**
 * @todo Split into multiple services or sagas
 */
@Injectable()
export class AudioService {
  private readonly logger = new Logger(this.constructor.name)

  private readonly audioTransformStrategy: AudioTransformStrategy
  private readonly audioTransformPreset: AudioTransformParameters
  private readonly storageStrategy: StorageStrategy
  private readonly namingStrategy: NamingStrategy
  private readonly temporaryDirectory: string

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly mediaSourceRepository: MediaSourceRepository,
    private readonly fileUtilsService: FileUtilsService,
    private readonly databaseService: DatabaseService,
    private readonly mediaAssetRepository: MediaAssetRepository,
    private readonly mediaAudioMetadataRepository: MediaAudioMetadataRepository,
    private readonly dashUtilsService: DashUtilsService,
  ) {
    this.audioTransformStrategy = this.options.audioTransformStrategy
    this.audioTransformPreset = this.options.audioTransformPreset
    this.storageStrategy = this.options.storageStrategy
    this.namingStrategy = this.options.namingStrategy
    this.temporaryDirectory = this.options.temporaryDirectory
  }

  async transform(sourceId: string): Promise<void> {
    const source = await this.mediaSourceRepository.findOne(sourceId)

    if (!source) {
      throw new Error('Media source not found')
    }

    const audio = await this.storageStrategy.downloadToBuffer(source.storagePath)

    const targetDirectory = join(this.temporaryDirectory, source.entityId)

    try {
      const result = await this.audioTransformStrategy.transform(audio, targetDirectory, this.audioTransformPreset)

      const manifestPath = join(targetDirectory, result.manifestName)
      const manifest = this.fileUtilsService.readFile(manifestPath)
      const manifestName = this.namingStrategy.generateDashManifestName(source.entityId)

      await this.storageStrategy.uploadFromBuffer(manifestName, manifest)

      for (const segmentName of result.segmentNames) {
        const segmentPath = join(targetDirectory, segmentName)
        const segment = this.fileUtilsService.readFile(segmentPath)
        await this.storageStrategy.uploadFromBuffer(
          this.namingStrategy.generateFileName(segmentName, source.entityId),
          segment,
        )
      }

      /**
       * @todo Add public URL to naming strategy
       */
      const publicUrl = 'test'

      const duration = this.dashUtilsService.getDurationFromManifest(manifestPath)

      await this.databaseService.sql.begin(async (transaction) => {
        const asset = await this.mediaAssetRepository.create(
          {
            entityType: source.entityType,
            entityId: source.entityId,
            sourceId: source.id,
            storageProvider: this.storageStrategy.storageProvider,
            storagePath: manifestName,
            mediaType: MediaType.AUDIO,
            publicUrl,
            fileSize: result.metadata.totalSize,
            format: 'dash',
          },
          transaction,
        )

        await this.mediaAudioMetadataRepository.create(
          {
            assetId: asset.id,
            bitrate: this.audioTransformPreset.bitrate.join(','),
            sampleRate: this.audioTransformPreset.sampleRate,
            channels: this.audioTransformPreset.channels,
            codec: this.audioTransformPreset.codec,
            duration,
          },
          transaction,
        )
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    } finally {
      this.fileUtilsService.deleteDirectory(targetDirectory)
    }
  }
}
