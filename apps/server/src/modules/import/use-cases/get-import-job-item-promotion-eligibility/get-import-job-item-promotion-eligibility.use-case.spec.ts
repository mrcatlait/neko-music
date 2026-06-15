import { GetImportJobItemPromotionEligibilityUseCase } from './get-import-job-item-promotion-eligibility.use-case'
import { ClaimReviewDecision, MetadataClaimField } from '../../enums'
import { MetadataClaimRepository, MetadataClaimReviewRepository } from '../../repositories'

describe('GetImportJobItemPromotionEligibilityUseCase', () => {
  let useCase: GetImportJobItemPromotionEligibilityUseCase
  let metadataClaimRepository: MetadataClaimRepository
  let metadataClaimReviewRepository: MetadataClaimReviewRepository

  beforeEach(() => {
    metadataClaimRepository = {
      findByImportJobItemId: vi.fn(),
    } as unknown as MetadataClaimRepository
    metadataClaimReviewRepository = {
      findByMetadataClaimIds: vi.fn(),
    } as unknown as MetadataClaimReviewRepository

    useCase = new GetImportJobItemPromotionEligibilityUseCase(metadataClaimRepository, metadataClaimReviewRepository)
  })

  it('should return eligible when required claims are resolved', async () => {
    // Arrange
    vi.mocked(metadataClaimRepository.findByImportJobItemId).mockResolvedValue([
      { id: 'claim-title', field: MetadataClaimField.Title },
      { id: 'claim-artist', field: MetadataClaimField.Artist },
      { id: 'claim-genre', field: MetadataClaimField.Genre },
    ] as never)
    vi.mocked(metadataClaimReviewRepository.findByMetadataClaimIds).mockResolvedValue([
      { metadataClaimId: 'claim-title', decision: ClaimReviewDecision.CreateNew, replacementValue: 'Track title' },
      { metadataClaimId: 'claim-artist', decision: ClaimReviewDecision.LinkExisting, replacementEntityId: 'artist-1' },
      { metadataClaimId: 'claim-genre', decision: ClaimReviewDecision.Ignore, replacementEntityId: null, replacementValue: null },
    ] as never)

    // Act
    const result = await useCase.invoke({
      importJobItemId: 'item-1',
    })

    // Assert
    expect(result).toEqual({
      importJobItemId: 'item-1',
      isEligible: true,
      unresolvedRequiredFields: [],
    })
  })

  it('should return unresolved required fields when pending or rejected', async () => {
    // Arrange
    vi.mocked(metadataClaimRepository.findByImportJobItemId).mockResolvedValue([
      { id: 'claim-title', field: MetadataClaimField.Title },
      { id: 'claim-artist', field: MetadataClaimField.Artist },
    ] as never)
    vi.mocked(metadataClaimReviewRepository.findByMetadataClaimIds).mockResolvedValue([
      { metadataClaimId: 'claim-title', decision: ClaimReviewDecision.Pending, replacementEntityId: null, replacementValue: null },
      { metadataClaimId: 'claim-artist', decision: ClaimReviewDecision.Reject, replacementEntityId: null, replacementValue: null },
    ] as never)

    // Act
    const result = await useCase.invoke({
      importJobItemId: 'item-1',
    })

    // Assert
    expect(result).toEqual({
      importJobItemId: 'item-1',
      isEligible: false,
      unresolvedRequiredFields: [MetadataClaimField.Title, MetadataClaimField.Artist],
    })
  })
})
