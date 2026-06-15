import { GetImportJobItemClaimsUseCase } from './get-import-job-item-claims.use-case'
import { ClaimReviewDecision, MetadataConfidence, MetadataClaimField } from '../../enums'
import { MetadataClaimRepository, MetadataClaimReviewRepository } from '../../repositories'

describe('GetImportJobItemClaimsUseCase', () => {
  it('should return claims with merged review decisions', async () => {
    // Arrange
    const metadataClaimRepository = {
      findByImportJobItemId: vi.fn().mockResolvedValue([
        {
          id: 'claim-1',
          importJobItemId: 'item-1',
          field: MetadataClaimField.Title,
          value: 'Track name',
          sourceAttribute: 'youtube.title',
          extractor: 'yt-dlp',
          confidence: MetadataConfidence.High,
        },
        {
          id: 'claim-2',
          importJobItemId: 'item-1',
          field: MetadataClaimField.Artist,
          value: 'Artist name',
          sourceAttribute: 'youtube.uploader',
          extractor: 'yt-dlp',
          confidence: MetadataConfidence.Medium,
        },
      ]),
    } as unknown as MetadataClaimRepository
    const metadataClaimReviewRepository = {
      findByMetadataClaimIds: vi.fn().mockResolvedValue([
        {
          metadataClaimId: 'claim-1',
          decision: ClaimReviewDecision.CreateNew,
          replacementEntityId: null,
          replacementValue: 'Track name',
        },
      ]),
    } as unknown as MetadataClaimReviewRepository
    const useCase = new GetImportJobItemClaimsUseCase(metadataClaimRepository, metadataClaimReviewRepository)

    // Act
    const result = await useCase.invoke({
      importJobItemId: 'item-1',
    })

    // Assert
    expect(result).toEqual([
      expect.objectContaining({
        id: 'claim-1',
        decision: ClaimReviewDecision.CreateNew,
      }),
      expect.objectContaining({
        id: 'claim-2',
        decision: ClaimReviewDecision.Pending,
      }),
    ])
  })
})
