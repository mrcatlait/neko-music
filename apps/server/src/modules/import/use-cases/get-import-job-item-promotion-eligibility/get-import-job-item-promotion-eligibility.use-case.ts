import { Injectable } from '@nestjs/common'

import { ClaimReviewDecision, MetadataClaimField } from '../../enums'
import { MetadataClaimRepository, MetadataClaimReviewRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'

const REQUIRED_CLAIM_FIELDS = [MetadataClaimField.Title, MetadataClaimField.Artist]

export interface GetImportJobItemPromotionEligibilityUseCaseParams {
  importJobItemId: string
}

export interface GetImportJobItemPromotionEligibilityUseCaseResult {
  importJobItemId: string
  isEligible: boolean
  unresolvedRequiredFields: MetadataClaimField[]
}

@Injectable()
export class GetImportJobItemPromotionEligibilityUseCase
  implements
    UseCase<
      GetImportJobItemPromotionEligibilityUseCaseParams,
      GetImportJobItemPromotionEligibilityUseCaseResult
    >
{
  constructor(
    private readonly metadataClaimRepository: MetadataClaimRepository,
    private readonly metadataClaimReviewRepository: MetadataClaimReviewRepository,
  ) {}

  async invoke(
    params: GetImportJobItemPromotionEligibilityUseCaseParams,
  ): Promise<GetImportJobItemPromotionEligibilityUseCaseResult> {
    const claims = await this.metadataClaimRepository.findByImportJobItemId(params.importJobItemId)
    const reviews = await this.metadataClaimReviewRepository.findByMetadataClaimIds(claims.map((claim) => claim.id))
    const reviewByClaimId = new Map(reviews.map((review) => [review.metadataClaimId, review]))

    const unresolvedRequiredFields = REQUIRED_CLAIM_FIELDS.filter((requiredField) => {
      const requiredClaims = claims.filter((claim) => claim.field === requiredField)

      if (requiredClaims.length === 0) {
        return true
      }

      return !requiredClaims.some((claim) => this.isResolved(reviewByClaimId.get(claim.id)))
    })

    return {
      importJobItemId: params.importJobItemId,
      isEligible: unresolvedRequiredFields.length === 0,
      unresolvedRequiredFields,
    }
  }

  private isResolved(
    review: { decision: ClaimReviewDecision; replacementEntityId: string | null; replacementValue: string | null } | undefined,
  ): boolean {
    if (!review) {
      return false
    }

    switch (review.decision) {
      case ClaimReviewDecision.LinkExisting:
      case ClaimReviewDecision.CreateNew:
        return true
      case ClaimReviewDecision.Ignore:
        return Boolean(review.replacementEntityId || review.replacementValue)
      default:
        return false
    }
  }
}
