import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ProcessingJobEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class ProcessingJobRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends ProcessingJobEntity>(processingJob: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "media"."ProcessingJob" ("pipelineId", "jobName", "jobOrder", "status")
      VALUES (${processingJob.pipelineId}, ${processingJob.jobName}, ${processingJob.jobOrder}, ${processingJob.status})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  update(processingJob: ProcessingJobEntity, sql?: Sql): Promise<ProcessingJobEntity> {
    return (sql ?? this.databaseService.sql)<ProcessingJobEntity[]>`
      UPDATE "media"."ProcessingJob"
      SET ${this.databaseService.sql(processingJob)}
      WHERE id = ${processingJob.id}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  findMany<Type extends ProcessingJobEntity>(pipelineId: string): Promise<Type[]> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "media"."ProcessingJob"
      WHERE "pipelineId" = ${pipelineId}
      ORDER BY "jobOrder" ASC
    `.then((result) => result)
  }
}
