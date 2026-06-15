import { Injectable } from '@nestjs/common'

import { MetadataClaim } from '../types/ingest-track-result.type'
import { MetadataClaimMatchRepository, MetadataClaimRepository, MetadataClaimReviewRepository } from '../repositories'
import { ClaimReviewDecision } from '../enums'
import { MetadataClaimMatchService } from './metadata-claim-match.service'

interface MetadataClaimContext {
  importJobItemId: string
  claim: MetadataClaim
}

@Injectable()
export class MetadataClaimProcessorService {
  constructor(
    private readonly metadataClaimRepository: MetadataClaimRepository,
    private readonly metadataClaimMatchRepository: MetadataClaimMatchRepository,
    private readonly metadataClaimReviewRepository: MetadataClaimReviewRepository,
    private readonly metadataClaimMatchService: MetadataClaimMatchService,
  ) {}

  async process(ctx: MetadataClaimContext): Promise<void> {
    const claim = await this.metadataClaimRepository.create({
      importJobItemId: ctx.importJobItemId,
      field: ctx.claim.field,
      value: ctx.claim.value,
      sourceAttribute: ctx.claim.sourceAttribute,
      extractor: ctx.claim.extractor,
      confidence: ctx.claim.confidence,
    })

    // const matches = await this.metadataClaimMatchService.match(ctx.claim)

    // for (const match of matches) {
    //   await this.metadataClaimMatchRepository.create({
    //     metadataClaimId: claim.id,
    //     entityId: match.entityId,
    //     entityType: match.entityType,
    //     score: match.score,
    //   })
    // }

    await this.metadataClaimReviewRepository.create({
      metadataClaimId: claim.id,
      decision: ClaimReviewDecision.Pending,
    })
  }
}
