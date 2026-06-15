import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { ClaimReviewDecision, MetadataClaimField } from '../../enums'
import { MetadataClaimRepository, MetadataClaimReviewHistoryRepository, MetadataClaimReviewRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'

const REQUIRED_CLAIM_FIELDS = new Set([MetadataClaimField.Title, MetadataClaimField.Artist])

export interface ReviewMetadataClaimUseCaseParams {
  metadataClaimId: string
  decision: ClaimReviewDecision
  reviewedBy: string
  replacementEntityId?: string
  replacementValue?: string
  reason?: string
}

export interface ReviewMetadataClaimUseCaseResult {
  id: string
}

@Injectable()
export class ReviewMetadataClaimUseCase
  implements UseCase<ReviewMetadataClaimUseCaseParams, ReviewMetadataClaimUseCaseResult>
{
  constructor(
    private readonly metadataClaimRepository: MetadataClaimRepository,
    private readonly metadataClaimReviewRepository: MetadataClaimReviewRepository,
    private readonly metadataClaimReviewHistoryRepository: MetadataClaimReviewHistoryRepository,
  ) {}

  async invoke(params: ReviewMetadataClaimUseCaseParams): Promise<ReviewMetadataClaimUseCaseResult> {
    const claim = await this.metadataClaimRepository.findOne(params.metadataClaimId)

    if (!claim) {
      throw new NotFoundException('Metadata claim not found')
    }

    const review = await this.metadataClaimReviewRepository.findOneByMetadataClaimId(params.metadataClaimId)

    if (!review) {
      throw new NotFoundException('Metadata claim review not found')
    }

    this.validateDecision(params, claim.field as MetadataClaimField)

    const replacementEntityId = params.replacementEntityId ?? null
    const replacementValue = params.replacementValue ?? null
    const reviewedAt = params.decision === ClaimReviewDecision.Pending ? null : new Date()
    const reviewedBy = params.decision === ClaimReviewDecision.Pending ? null : params.reviewedBy

    await this.metadataClaimReviewRepository.update(review.id, {
      decision: params.decision,
      replacementEntityId,
      replacementValue,
      reviewedAt,
      reviewedBy,
    })

    await this.metadataClaimReviewHistoryRepository.create({
      metadataClaimReviewId: review.id,
      decisionFrom: review.decision,
      decisionTo: params.decision,
      replacementEntityIdFrom: review.replacementEntityId,
      replacementEntityIdTo: replacementEntityId,
      replacementValueFrom: review.replacementValue,
      replacementValueTo: replacementValue,
      reason: params.reason ?? null,
      changedBy: params.reviewedBy,
    })

    return {
      id: review.id,
    }
  }

  private validateDecision(params: ReviewMetadataClaimUseCaseParams, field: MetadataClaimField): void {
    const hasReplacement = Boolean(params.replacementEntityId || params.replacementValue)

    if (params.decision === ClaimReviewDecision.LinkExisting && !params.replacementEntityId) {
      throw new BadRequestException('link_existing decision requires replacementEntityId')
    }

    if (params.decision === ClaimReviewDecision.CreateNew && !params.replacementValue) {
      throw new BadRequestException('create_new decision requires replacementValue')
    }

    if (params.decision === ClaimReviewDecision.Ignore && REQUIRED_CLAIM_FIELDS.has(field) && !hasReplacement) {
      throw new BadRequestException('Required claim ignore needs replacement resolution')
    }
  }
}
