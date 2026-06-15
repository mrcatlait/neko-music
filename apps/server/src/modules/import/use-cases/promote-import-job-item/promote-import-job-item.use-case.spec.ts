import { BadRequestException, NotFoundException } from '@nestjs/common'

import { PromoteImportJobItemUseCase } from './promote-import-job-item.use-case'
import { ClaimReviewDecision, MetadataClaimField } from '../../enums'
import { ImportJobItemRepository, MetadataClaimRepository, MetadataClaimReviewRepository } from '../../repositories'
import { GetImportJobItemPromotionEligibilityUseCase } from '../get-import-job-item-promotion-eligibility'
import { CreateBackstageArtistUseCase } from '@/modules/backstage/artist/use-cases'
import { CreateBackstageAlbumUseCase } from '@/modules/backstage/album/use-cases'
import { CreateBackstageTrackUseCase } from '@/modules/backstage/track/use-cases'
import { IngestMediaFromPathUseCase } from '@/modules/media/use-cases'

describe('PromoteImportJobItemUseCase', () => {
  const createUseCase = () => {
    const importJobItemRepository = {
      findOne: vi.fn(),
      update: vi.fn(),
    } as unknown as ImportJobItemRepository
    const metadataClaimRepository = {
      findByImportJobItemId: vi.fn(),
    } as unknown as MetadataClaimRepository
    const metadataClaimReviewRepository = {
      findByMetadataClaimIds: vi.fn(),
    } as unknown as MetadataClaimReviewRepository
    const getImportJobItemPromotionEligibilityUseCase = {
      invoke: vi.fn(),
    } as unknown as GetImportJobItemPromotionEligibilityUseCase
    const createBackstageArtistUseCase = {
      invoke: vi.fn(),
    } as unknown as CreateBackstageArtistUseCase
    const createBackstageAlbumUseCase = {
      invoke: vi.fn(),
    } as unknown as CreateBackstageAlbumUseCase
    const createBackstageTrackUseCase = {
      invoke: vi.fn(),
    } as unknown as CreateBackstageTrackUseCase
    const ingestMediaFromPathUseCase = {
      invoke: vi.fn(),
    } as unknown as IngestMediaFromPathUseCase

    const useCase = new PromoteImportJobItemUseCase(
      importJobItemRepository,
      metadataClaimRepository,
      metadataClaimReviewRepository,
      getImportJobItemPromotionEligibilityUseCase,
      createBackstageArtistUseCase,
      createBackstageAlbumUseCase,
      createBackstageTrackUseCase,
      ingestMediaFromPathUseCase,
    )

    return {
      useCase,
      importJobItemRepository,
      metadataClaimRepository,
      metadataClaimReviewRepository,
      getImportJobItemPromotionEligibilityUseCase,
      createBackstageArtistUseCase,
      createBackstageAlbumUseCase,
      createBackstageTrackUseCase,
      ingestMediaFromPathUseCase,
    }
  }

  it('should promote an eligible item and ingest staged assets', async () => {
    // Arrange
    const {
      useCase,
      importJobItemRepository,
      metadataClaimRepository,
      metadataClaimReviewRepository,
      getImportJobItemPromotionEligibilityUseCase,
      createBackstageArtistUseCase,
      createBackstageAlbumUseCase,
      createBackstageTrackUseCase,
      ingestMediaFromPathUseCase,
    } = createUseCase()

    vi.mocked(importJobItemRepository.findOne).mockResolvedValue({
      id: 'item-1',
      audioPath: '/tmp/audio.mp3',
      artworkPath: '/tmp/artwork.png',
    } as never)
    vi.mocked(getImportJobItemPromotionEligibilityUseCase.invoke).mockResolvedValue({
      importJobItemId: 'item-1',
      isEligible: true,
      unresolvedRequiredFields: [],
    })
    vi.mocked(metadataClaimRepository.findByImportJobItemId).mockResolvedValue([
      { id: 'c-title', field: MetadataClaimField.Title, value: 'Song title' },
      { id: 'c-artist', field: MetadataClaimField.Artist, value: 'Artist name' },
      { id: 'c-album', field: MetadataClaimField.Album, value: 'Album name' },
    ] as never)
    vi.mocked(metadataClaimReviewRepository.findByMetadataClaimIds).mockResolvedValue([
      { metadataClaimId: 'c-title', decision: ClaimReviewDecision.CreateNew, replacementValue: 'Song title' },
      { metadataClaimId: 'c-artist', decision: ClaimReviewDecision.CreateNew, replacementValue: 'Artist name' },
      { metadataClaimId: 'c-album', decision: ClaimReviewDecision.CreateNew, replacementValue: 'Album name' },
    ] as never)
    vi.mocked(createBackstageArtistUseCase.invoke).mockResolvedValue({ id: 'artist-1' } as never)
    vi.mocked(createBackstageAlbumUseCase.invoke).mockResolvedValue({ id: 'album-1' } as never)
    vi.mocked(createBackstageTrackUseCase.invoke).mockResolvedValue({ id: 'track-1' } as never)
    vi.mocked(ingestMediaFromPathUseCase.invoke).mockResolvedValue({ processingJobId: 'media-job-1' } as never)

    // Act
    const result = await useCase.invoke({
      importJobItemId: 'item-1',
      userId: 'user-1',
    })

    // Assert
    expect(result.id).toBe('item-1')
    expect(createBackstageArtistUseCase.invoke).toHaveBeenCalledTimes(1)
    expect(createBackstageAlbumUseCase.invoke).toHaveBeenCalledTimes(1)
    expect(createBackstageTrackUseCase.invoke).toHaveBeenCalledTimes(1)
    expect(ingestMediaFromPathUseCase.invoke).toHaveBeenCalledTimes(2)
  })

  it('should fail when item is not eligible for promotion', async () => {
    // Arrange
    const { useCase, importJobItemRepository, getImportJobItemPromotionEligibilityUseCase } = createUseCase()

    vi.mocked(importJobItemRepository.findOne).mockResolvedValue({
      id: 'item-1',
      audioPath: null,
      artworkPath: null,
    } as never)
    vi.mocked(getImportJobItemPromotionEligibilityUseCase.invoke).mockResolvedValue({
      importJobItemId: 'item-1',
      isEligible: false,
      unresolvedRequiredFields: [MetadataClaimField.Title],
    })

    // Act
    const invoke = () =>
      useCase.invoke({
        importJobItemId: 'item-1',
        userId: 'user-1',
      })

    // Assert
    await expect(invoke).rejects.toThrow(BadRequestException)
  })

  it('should fail when import job item is missing', async () => {
    // Arrange
    const { useCase, importJobItemRepository } = createUseCase()
    vi.mocked(importJobItemRepository.findOne).mockResolvedValue(undefined)

    // Act
    const invoke = () =>
      useCase.invoke({
        importJobItemId: 'item-missing',
        userId: 'user-1',
      })

    // Assert
    await expect(invoke).rejects.toThrow(NotFoundException)
  })
})
