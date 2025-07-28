import { Injectable } from '@nestjs/common'

import { ArtistArtworkRepository, ArtistArtworkVariantRepository } from '../../repositories'
import { RecordInDatabaseOptions, UploadStrategy } from './upload.strategy'
import { StorageStrategyRegistry } from '../storage'

import { DatabaseService } from '@modules/database'
import { ArtworkSize, ProcessingStatus } from '@modules/media/enums'

@Injectable()
export class ArtistArtworkUploadStrategy extends UploadStrategy {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly artistArtworkRepository: ArtistArtworkRepository,
    private readonly artistArtworkVariantRepository: ArtistArtworkVariantRepository,
    storageStrategyRegistry: StorageStrategyRegistry,
  ) {
    super(storageStrategyRegistry)
  }

  protected recordInDatabase(options: RecordInDatabaseOptions): Promise<void> {
    return this.databaseService.sql.begin(async (transaction) => {
      const mediaFile = await this.artistArtworkRepository.create(
        {
          artistId: options.entityId,
          backgroundColor: '',
          textColor: '',
          processingStatus: ProcessingStatus.PENDING,
          processingAttempts: 0,
          processingError: '',
        },
        transaction,
      )

      await this.artistArtworkVariantRepository.create(
        {
          artistArtworkId: mediaFile.id,
          format: options.fileExtension,
          storageProvider: options.storageProvider,
          storagePath: options.storagePath,
          publicUrl: options.publicUrl,
          size: ArtworkSize.ORIGINAL,
          fileSize: options.fileSize,
        },
        transaction,
      )
    })
  }
}
