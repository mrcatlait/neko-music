import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, sql } from 'kysely'

import { EntityType, MediaType, ProcessingStatus, ProcessingStep } from '../enums'

import {
  AssetTable,
  Database,
  ImageMetadataTable,
  InjectDatabase,
  ProcessingJobTable,
  ProcessingStepTable,
  SourceAssetTable,
} from '@/modules/database'

export interface ImageAssetWithMetadata {
  asset: Selectable<AssetTable>
  metadata: Omit<Selectable<ImageMetadataTable>, 'assetId'>
}

export interface CreateImageAssetParameters {
  image: Insertable<AssetTable>
  metadata: Omit<Insertable<ImageMetadataTable>, 'assetId'>
}

@Injectable()
export class MediaRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

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

  findProcessingJobBySourceAssetId(sourceAssetId: string): Promise<Selectable<ProcessingJobTable> | undefined> {
    return this.database
      .selectFrom('media.ProcessingJob')
      .where('sourceAssetId', '=', sourceAssetId)
      .selectAll()
      .executeTakeFirst()
  }

  findSourceAssetById(id: string): Promise<Selectable<SourceAssetTable> | undefined> {
    return this.database.selectFrom('media.SourceAsset').where('id', '=', id).selectAll().executeTakeFirst()
  }

  findSourceAssetByEntityTypeAndEntityId(
    entityType: EntityType,
    entityId: string,
  ): Promise<Selectable<SourceAssetTable> | undefined> {
    return this.database
      .selectFrom('media.SourceAsset')
      .where('entityType', '=', entityType)
      .where('entityId', '=', entityId)
      .selectAll()
      .executeTakeFirst()
  }

  /**
   * Returns image assets with metadata for an entity in a single round-trip using JSONB aggregation.
   */
  async findImageAssetsByEntityTypeAndEntityId(
    entityType: EntityType,
    entityId: string,
  ): Promise<ImageAssetWithMetadata[]> {
    interface Row {
      assets: ImageAssetWithMetadata[]
    }

    const compiled = sql<Row>`SELECT COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'asset', jsonb_build_object(
              'id', a.id,
              'storagePath', a."storagePath",
              'format', a.format,
              'fileSize', a."fileSize"
            ),
            'metadata', jsonb_build_object(
              'width', m.width,
              'height', m.height,
              'dominantColor', m."dominantColor"
            )
          )
          ORDER BY m.width, m.height
        )
        FROM "media"."Asset" a
        INNER JOIN "media"."ImageMetadata" m ON m."assetId" = a.id
        WHERE a."entityType" = ${entityType}
          AND a."entityId" = ${entityId}
          AND a."mediaType" = ${MediaType.IMAGE}
      ),
      '[]'::jsonb
    ) AS assets`.compile(this.database)

    const { rows } = await this.database.executeQuery<Row>(compiled)
    const row = rows[0]
    if (!row?.assets) return []

    return row.assets
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
