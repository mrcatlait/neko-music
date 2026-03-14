import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, sql } from 'kysely'

import { EntityType, MediaType, ProcessingStatus, ProcessingStep } from '../enums'
import {
  AssetTable,
  ImageMetadataTable,
  MediaSchema,
  ProcessingJobTable,
  ProcessingStepTable,
  SourceAssetTable,
} from '../media.schema'

import { Database, InjectDatabase } from '@/modules/database'

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
  constructor(@InjectDatabase() private readonly database: Database<MediaSchema>) {}

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
          status: ProcessingStatus.Pending,
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
            status: ProcessingStatus.Pending,
          })
          .execute()
      }

      return processingJobId
    })
  }

  createProcessingJob(processingJob: Insertable<ProcessingJobTable>): Promise<string> {
    return this.database
      .insertInto('media.ProcessingJob')
      .values(processingJob)
      .returning('id')
      .executeTakeFirstOrThrow()
      .then((result) => result.id)
  }

  createProcessingSteps(processingSteps: Insertable<ProcessingStepTable>[]): Promise<void> {
    return this.database
      .insertInto('media.ProcessingStep')
      .values(processingSteps)
      .execute()
      .then(() => undefined)
  }

  findPendingProcessingJob(): Promise<Selectable<ProcessingJobTable> | undefined> {
    return this.database
      .selectFrom('media.ProcessingJob')
      .where('status', '=', ProcessingStatus.Pending)
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
              'fileSize', a."fileSize",
              'sourceAssetId', a."sourceAssetId"
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
          AND a."mediaType" = ${MediaType.Image}
      ),
      '[]'::jsonb
    ) AS assets`.compile(this.database)

    const { rows } = await this.database.executeQuery<Row>(compiled)
    const row = rows[0]

    return row.assets
  }
}
