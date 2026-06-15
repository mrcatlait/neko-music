import { BadRequestException, NotFoundException } from '@nestjs/common'

import { ReviewMetadataClaimUseCase } from './review-metadata-claim.use-case'
import { ClaimReviewDecision, MetadataClaimField } from '../../enums'
import { MetadataClaimRepository, MetadataClaimReviewHistoryRepository, MetadataClaimReviewRepository } from '../../repositories'

describe('ReviewMetadataClaimUseCase', () => {
  let useCase: ReviewMetadataClaimUseCase
  let metadataClaimRepository: MetadataClaimRepository
  let metadataClaimReviewRepository: MetadataClaimReviewRepository
  let metadataClaimReviewHistoryRepository: MetadataClaimReviewHistoryRepository

  beforeEach(() => {
    metadataClaimRepository = {
      findOne: vi.fn(),
    } as unknown as MetadataClaimRepository
    metadataClaimReviewRepository = {
      findOneByMetadataClaimId: vi.fn(),
      update: vi.fn(),
    } as unknown as MetadataClaimReviewRepository
    metadataClaimReviewHistoryRepository = {
      create: vi.fn(),
    } as unknown as MetadataClaimReviewHistoryRepository

    useCase = new ReviewMetadataClaimUseCase(
      metadataClaimRepository,
      metadataClaimReviewRepository,
      metadataClaimReviewHistoryRepository,
    )
  })

  it('should update claim review with link_existing decision', async () => {
    // Arrange
    vi.mocked(metadataClaimRepository.findOne).mockResolvedValue({
      id: 'claim-1',
      field: MetadataClaimField.Artist,
    } as never)
    vi.mocked(metadataClaimReviewRepository.findOneByMetadataClaimId).mockResolvedValue({
      id: 'review-1',
      decision: ClaimReviewDecision.Pending,
      replacementEntityId: null,
      replacementValue: null,
    } as never)

    // Act
    const result = await useCase.invoke({
      metadataClaimId: 'claim-1',
      decision: ClaimReviewDecision.LinkExisting,
      reviewedBy: 'user-1',
      replacementEntityId: 'artist-1',
    })

    // Assert
    expect(metadataClaimReviewRepository.update).toHaveBeenCalledWith('review-1', {
      decision: ClaimReviewDecision.LinkExisting,
      reviewedBy: 'user-1',
      reviewedAt: expect.any(Date),
      replacementEntityId: 'artist-1',
      replacementValue: null,
    })
    expect(metadataClaimReviewHistoryRepository.create).toHaveBeenCalledWith({
      metadataClaimReviewId: 'review-1',
      decisionFrom: ClaimReviewDecision.Pending,
      decisionTo: ClaimReviewDecision.LinkExisting,
      replacementEntityIdFrom: null,
      replacementEntityIdTo: 'artist-1',
      replacementValueFrom: null,
      replacementValueTo: null,
      reason: null,
      changedBy: 'user-1',
    })
    expect(result).toEqual({ id: 'review-1' })
  })

  it('should require replacement resolution when required claim is ignored', async () => {
    // Arrange
    vi.mocked(metadataClaimRepository.findOne).mockResolvedValue({
      id: 'claim-1',
      field: MetadataClaimField.Title,
    } as never)
    vi.mocked(metadataClaimReviewRepository.findOneByMetadataClaimId).mockResolvedValue({
      id: 'review-1',
      decision: ClaimReviewDecision.Pending,
      replacementEntityId: null,
      replacementValue: null,
    } as never)

    // Act & Assert
    await expect(
      useCase.invoke({
        metadataClaimId: 'claim-1',
        decision: ClaimReviewDecision.Ignore,
        reviewedBy: 'user-1',
      }),
    ).rejects.toThrow(BadRequestException)
  })

  it('should throw when metadata claim does not exist', async () => {
    // Arrange
    vi.mocked(metadataClaimRepository.findOne).mockResolvedValue(undefined)

    // Act & Assert
    await expect(
      useCase.invoke({
        metadataClaimId: 'missing',
        decision: ClaimReviewDecision.Reject,
        reviewedBy: 'user-1',
      }),
    ).rejects.toThrow(NotFoundException)
  })
})
