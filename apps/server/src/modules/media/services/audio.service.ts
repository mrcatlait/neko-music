import { Inject, Injectable, Logger } from '@nestjs/common'
import { join } from 'node:path'
import { rmSync } from 'node:fs'

import { AudioTransformParameters, AudioTransformStrategy, NamingStrategy, StorageStrategy } from '../strategies'
import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { MediaModuleOptions } from '../types'
import { AssetRepository, AudioMetadataRepository, SourceAssetRepository } from '../repositories'
import { FileService } from './file.service'
import { DashService } from './dash.service'

@Injectable()
export class AudioService {
  private readonly logger = new Logger(this.constructor.name)

  private readonly audioTransformStrategy: AudioTransformStrategy
  private readonly namingStrategy: NamingStrategy
  private readonly storageStrategy: StorageStrategy
  private readonly audioTransformParameters: AudioTransformParameters
  private readonly temporaryDirectory: string
  private readonly format = 'mpeg-dash'

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly sourceAssetRepository: SourceAssetRepository,
    private readonly dashService: DashService,
    private readonly assetRepository: AssetRepository,
    private readonly audioMetadataRepository: AudioMetadataRepository,
    private readonly fileService: FileService,
  ) {
    this.audioTransformStrategy = options.audioTransformStrategy
    this.namingStrategy = options.namingStrategy
    this.storageStrategy = options.storageStrategy
    this.audioTransformParameters = options.audioTransformPreset
    this.temporaryDirectory = options.temporaryDirectory
  }

  async transform(sourceAssetId: string): Promise<void> {
    const source = await this.sourceAssetRepository.findOne(sourceAssetId)

    if (!source) {
      throw new Error(`Media source with id "${sourceAssetId}" not found`)
    }

    /**
     * Temporary folder for the transformed files
     */
    const folder = `${this.temporaryDirectory}/${crypto.randomUUID()}`

    const sourceFileName = this.namingStrategy.generateRandomFileName(source.format)
    const sourceFilePath = join(folder, sourceFileName)

    await this.storageStrategy.downloadToFile(source.storagePath, sourceFilePath)

    let createdManifest: string | undefined
    const createdSegments: string[] = []

    // todo improve rollback with DB records
    try {
      const result = await this.audioTransformStrategy.transform(sourceFilePath, folder, this.audioTransformParameters)

      const manifestName = this.namingStrategy.generateStreamFilename({ sourceAssetId, fileName: result.manifestName })
      const manifestPath = join(folder, result.manifestName)
      const manifestStoragePath = await this.storageStrategy.uploadFromFile(manifestName, manifestPath)
      createdManifest = manifestStoragePath

      for (const segment of result.segments) {
        const segmentName = this.namingStrategy.generateStreamFilename({ sourceAssetId, fileName: segment })
        const segmentPath = join(folder, segment)
        const segmentStoragePath = await this.storageStrategy.uploadFromFile(segmentName, segmentPath)
        createdSegments.push(segmentStoragePath)
      }

      const fileSize = this.fileService.getDirectorySize(folder)
      const duration = this.dashService.getDurationFromManifest(manifestPath)

      const asset = await this.assetRepository.create({
        sourceAssetId: source.id,
        mediaType: source.mediaType,
        entityType: source.entityType,
        entityId: source.entityId,
        storageProvider: this.storageStrategy.name,
        storagePath: manifestStoragePath,
        fileSize,
        format: this.format,
      })

      await this.audioMetadataRepository.create({
        assetId: asset.id,
        bitrate: this.audioTransformParameters.bitrate.join(','),
        sampleRate: this.audioTransformParameters.sampleRate,
        channels: this.audioTransformParameters.channels,
        codec: this.audioTransformParameters.codec,
        duration,
      })
    } catch (error) {
      if (createdManifest) {
        await this.storageStrategy.delete(createdManifest)
      }

      for (const segment of createdSegments) {
        await this.storageStrategy.delete(segment)
      }

      throw error
    } finally {
      rmSync(folder, { recursive: true })
    }
  }
}
