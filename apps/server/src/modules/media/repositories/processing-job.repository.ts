import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { MediaSchema, ProcessingJobTable } from '../media.schema'
import { EntityType } from '../enums'

import { Database } from '@/modules/database/types'
import { InjectDatabase } from '@/modules/database'

export interface FindManyByEntityParameters {
  entityType: EntityType
  entityId?: string
  entityIds?: string[]
}

export type ProcessingJobWithEntityId = Selectable<ProcessingJobTable> & { entityId: string }

@Injectable()
export class ProcessingJobRepository {
  constructor(@InjectDatabase() private readonly database: Database<MediaSchema>) {}

  findManyByEntity(params: FindManyByEntityParameters): Promise<ProcessingJobWithEntityId[]> {
    if (params.entityIds?.length === 0) {
      return Promise.resolve([])
    }

    let query = this.database
      .selectFrom('media.SourceAsset')
      .innerJoin('media.ProcessingJob', (join) =>
        join.onRef('media.SourceAsset.id', '=', 'media.ProcessingJob.sourceAssetId'),
      )
      .where('media.SourceAsset.entityType', '=', params.entityType)
      .select((eb) => eb.ref('media.SourceAsset.entityId').as('entityId'))
      .selectAll('media.ProcessingJob')
      .distinctOn('media.SourceAsset.entityId')
      .orderBy('media.SourceAsset.entityId')
      .orderBy('media.SourceAsset.createdAt', 'desc')

    if (params.entityId !== undefined) {
      query = query.where('media.SourceAsset.entityId', '=', params.entityId)
    } else if (params.entityIds !== undefined) {
      query = query.where('media.SourceAsset.entityId', 'in', params.entityIds)
    } else {
      throw new Error('Either entityId or entityIds must be provided')
    }

    return query.execute()
  }
}
