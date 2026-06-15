import { Injectable } from '@nestjs/common'

import { Selectable } from 'kysely'

import { ClaimReviewDecision } from '../enums'
import { ImportSchema, MetadataClaimReviewTable } from '../import.schema'

import { InjectDatabase, Database } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

@Injectable()
export class MetadataClaimReviewRepository extends Repository<ImportSchema, 'import.MetadataClaimReview'> {
  constructor(@InjectDatabase() database: Database<ImportSchema>) {
    super(database, 'import.MetadataClaimReview')
  }

  findOneByMetadataClaimId(metadataClaimId: string): Promise<Selectable<MetadataClaimReviewTable> | undefined> {
    return this.database
      .selectFrom('import.MetadataClaimReview')
      .where('metadataClaimId', '=', metadataClaimId)
      .selectAll()
      .executeTakeFirst()
  }

  findByMetadataClaimIds(metadataClaimIds: string[]): Promise<Selectable<MetadataClaimReviewTable>[]> {
    if (metadataClaimIds.length === 0) {
      return Promise.resolve([])
    }

    return this.database
      .selectFrom('import.MetadataClaimReview')
      .where('metadataClaimId', 'in', metadataClaimIds)
      .selectAll()
      .execute()
  }

  countPendingByJobId(jobId: string): Promise<number> {
    return this.database
      .selectFrom('import.MetadataClaimReview as review')
      .innerJoin('import.MetadataClaim as claim', 'claim.id', 'review.metadataClaimId')
      .innerJoin('import.ImportJobItem as item', 'item.id', 'claim.importJobItemId')
      .where('item.jobId', '=', jobId)
      .where('review.decision', '=', ClaimReviewDecision.Pending)
      .select((eb) => eb.fn.countAll().as('count'))
      .executeTakeFirst()
      .then((row) => Number(row?.count ?? 0))
  }
}
