import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { ProcessingStatus, ProcessingStep } from '../enums'

import {
  AssetTable,
  Database,
  ImageMetadataTable,
  InjectDatabase,
  ProcessingJobTable,
  ProcessingStepTable,
  SourceAssetTable,
  UploadTokenTable,
} from '@/modules/database'

export interface CreateImageAssetParameters {
  image: Insertable<AssetTable>
  metadata: Omit<Insertable<ImageMetadataTable>, 'assetId'>
}

@Injectable()
export class MediaRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

  /**
   * Find upload token by ID
   */
  findUploadTokenById(id: string): Promise<Selectable<UploadTokenTable> | undefined> {
    return this.database.selectFrom('media.UploadToken').where('id', '=', id).selectAll().executeTakeFirst()
  }

  /**
   * Create upload token
   */
  createUploadToken(uploadToken: Insertable<UploadTokenTable>): Promise<Selectable<UploadTokenTable>> {
    return this.database.insertInto('media.UploadToken').values(uploadToken).returningAll().executeTakeFirstOrThrow()
  }

  /**
   * Delete upload token by ID
   */
  deleteUploadTokenById(id: string): Promise<void> {
    return this.database
      .deleteFrom('media.UploadToken')
      .where('id', '=', id)
      .execute()
      .then(() => undefined)
  }

  /**
   * Delete expired upload tokens
   */
  deleteExpiredUploadTokens(): Promise<void> {
    return this.database
      .deleteFrom('media.UploadToken')
      .where('expiresAt', '<', new Date())
      .execute()
      .then(() => undefined)
  }

  /**
   * Create source asset and processing job in a single transaction
   */
  createSourceAssetAndProcessingJob(
    sourceAsset: Insertable<SourceAssetTable>,
    processingSteps: ProcessingStep[],
  ): Promise<string> {
    return this.database.transaction().execute(async (tx) => {
      const createdSourceAsset = await tx
        .insertInto('media.SourceAsset')
        .values(sourceAsset)
        .returning('id')
        .executeTakeFirstOrThrow()

      const processingJobId = await tx
        .insertInto('media.ProcessingJob')
        .values({
          sourceAssetId: createdSourceAsset.id,
          status: ProcessingStatus.PENDING,
        })
        .returning('id')
        .executeTakeFirstOrThrow()
        .then((processingJob) => processingJob.id)

      for (let index = 0; index < processingSteps.length; index++) {
        const step = processingSteps[index]

        await tx
          .insertInto('media.ProcessingStep')
          .values({
            jobId: processingJobId,
            name: step,
            order: index + 1,
            status: ProcessingStatus.PENDING,
          })
          .execute()
      }

      return processingJobId
    })
  }

  findPendingProcessingJob(): Promise<Selectable<ProcessingJobTable> | undefined> {
    return this.database
      .selectFrom('media.ProcessingJob')
      .where('status', '=', ProcessingStatus.PENDING)
      .orderBy('createdAt', 'asc')
      .selectAll()
      .executeTakeFirst()
  }

  findProcessingStepsByJobId(jobId: string): Promise<Selectable<ProcessingStepTable>[]> {
    return this.database
      .selectFrom('media.ProcessingStep')
      .where('jobId', '=', jobId)
      .orderBy('order', 'asc')
      .selectAll()
      .execute()
  }

  updateProcessingJob(job: Selectable<ProcessingJobTable>): Promise<void> {
    return this.database
      .updateTable('media.ProcessingJob')
      .set({
        status: job.status,
        startedAt: job.startedAt,
        completedAt: job.completedAt,
      })
      .where('id', '=', job.id)
      .execute()
      .then(() => undefined)
  }

  updateProcessingStep(step: Selectable<ProcessingStepTable>): Promise<void> {
    return this.database
      .updateTable('media.ProcessingStep')
      .set(step)
      .where('id', '=', step.id)
      .execute()
      .then(() => undefined)
  }

  findSourceAssetById(id: string): Promise<Selectable<SourceAssetTable> | undefined> {
    return this.database.selectFrom('media.SourceAsset').where('id', '=', id).selectAll().executeTakeFirst()
  }

  createImageAsset(parameters: CreateImageAssetParameters): Promise<Selectable<AssetTable>> {
    return this.database.transaction().execute(async (tx) => {
      const asset = await tx.insertInto('media.Asset').values(parameters.image).returningAll().executeTakeFirstOrThrow()
      await tx
        .insertInto('media.ImageMetadata')
        .values({ ...parameters.metadata, assetId: asset.id })
        .execute()
      return asset
    })
  }

  deleteAssetById(id: string): Promise<void> {
    return this.database
      .deleteFrom('media.Asset')
      .where('id', '=', id)
      .execute()
      .then(() => undefined)
  }

  deleteImageMetadataById(id: string): Promise<void> {
    return this.database
      .deleteFrom('media.ImageMetadata')
      .where('assetId', '=', id)
      .execute()
      .then(() => undefined)
  }
}
