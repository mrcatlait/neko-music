import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ProcessingPipelineEntity } from '../entities'
import { ProcessingStatus } from '../enums'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class ProcessingPipelineRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends ProcessingPipelineEntity>(processingPipeline: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "media"."ProcessingPipeline" ("sourceId", "status")
      VALUES (${processingPipeline.sourceId}, ${processingPipeline.status})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  update(processingPipeline: ProcessingPipelineEntity, sql?: Sql): Promise<ProcessingPipelineEntity> {
    return (sql ?? this.databaseService.sql)<ProcessingPipelineEntity[]>`
      UPDATE "media"."ProcessingPipeline"
      SET ${this.databaseService.sql(processingPipeline)}
      WHERE id = ${processingPipeline.id}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "media"."ProcessingPipeline" WHERE id = ${id}
    `.then(() => undefined)
  }

  findOne<Type extends ProcessingPipelineEntity>(id: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "media"."ProcessingPipeline"
      WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  findOneByStatus<Type extends ProcessingPipelineEntity>(status: ProcessingStatus): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "media"."ProcessingPipeline"
      WHERE status = ${status}
      LIMIT 1
    `.then((result) => result.at(0))
  }
}
