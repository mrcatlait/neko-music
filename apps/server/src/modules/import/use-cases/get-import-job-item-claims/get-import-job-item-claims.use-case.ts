import { Injectable } from '@nestjs/common'

import { ClaimReviewDecision } from '../../enums'
import { ImportJobItemClaim } from '../../models'
import { MetadataClaimRepository, MetadataClaimReviewRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'

export interface GetImportJobItemClaimsUseCaseParams {
  importJobItemId: string
}

@Injectable()
export class GetImportJobItemClaimsUseCase
  implements UseCase<GetImportJobItemClaimsUseCaseParams, ImportJobItemClaim[]>
{
  constructor(
    private readonly metadataClaimRepository: MetadataClaimRepository,
    private readonly metadataClaimReviewRepository: MetadataClaimReviewRepository,
  ) {}

  async invoke(params: GetImportJobItemClaimsUseCaseParams): Promise<ImportJobItemClaim[]> {
    const claims = await this.metadataClaimRepository.findByImportJobItemId(params.importJobItemId)
    const reviews = await this.metadataClaimReviewRepository.findByMetadataClaimIds(claims.map((claim) => claim.id))
    const reviewByClaimId = new Map(reviews.map((review) => [review.metadataClaimId, review]))

    return claims.map((claim) => {
      const review = reviewByClaimId.get(claim.id)

      return {
        id: claim.id,
        importJobItemId: claim.importJobItemId,
        field: claim.field,
        value: claim.value,
        sourceAttribute: claim.sourceAttribute,
        extractor: claim.extractor,
        confidence: claim.confidence,
        decision: review?.decision ?? ClaimReviewDecision.Pending,
        replacementEntityId: review?.replacementEntityId ?? null,
        replacementValue: review?.replacementValue ?? null,
      }
    })
  }
}
