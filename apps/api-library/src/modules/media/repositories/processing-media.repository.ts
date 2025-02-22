import { Injectable } from '@nestjs/common'

import { ProcessingMediaEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class ProcessingMediaRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findOne(id: string): Promise<ProcessingMediaEntity | undefined> {
    return this.databaseService.sql<ProcessingMediaEntity[]>`
      SELECT * FROM "media"."ProcessingMediaEntity" WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  findOneByEntity(
    entity: Pick<ProcessingMediaEntity, 'entity_type' | 'entity_id'>,
  ): Promise<ProcessingMediaEntity | undefined> {
    return this.databaseService.sql<ProcessingMediaEntity[]>`
      SELECT * FROM "media"."ProcessingMediaEntity" WHERE entity_type = ${entity.entity_type} AND entity_id = ${entity.entity_id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  create(
    processingMediaEntity: Omit<ProcessingMediaEntity, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<ProcessingMediaEntity> {
    return this.databaseService.sql<ProcessingMediaEntity[]>`
      INSERT INTO "media"."ProcessingMediaEntity" ${this.databaseService.sql(processingMediaEntity)}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  update(
    processingMediaEntity: Partial<Omit<ProcessingMediaEntity, 'created_at' | 'updated_at'>> & { id: string },
  ): Promise<ProcessingMediaEntity> {
    return this.databaseService.sql<ProcessingMediaEntity[]>`
      UPDATE "media"."ProcessingMediaEntity" SET ${this.databaseService.sql(processingMediaEntity)}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${processingMediaEntity.id}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "media"."ProcessingMediaEntity" WHERE id = ${id}
    `.then(() => undefined)
  }
}
