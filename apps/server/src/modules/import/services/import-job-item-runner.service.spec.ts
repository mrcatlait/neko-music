import { ImportJobItemRunnerService } from './import-job-item-runner.service'
import { ImportStatus, MetadataClaimField, MetadataConfidence } from '../enums'
import { ImportStrategyFactory } from '../strategies'
import { ImportJobItemRepository } from '../repositories'
import { MetadataClaimProcessorService } from './metadata-claim-processor.service'

describe('ImportJobItemRunnerService', () => {
  const createService = () => {
    const importStrategyFactory = {
      create: vi.fn(),
    } as unknown as ImportStrategyFactory
    const importJobItemRepository = {
      update: vi.fn(),
    } as unknown as ImportJobItemRepository
    const metadataClaimProcessorService = {
      process: vi.fn(),
    } as unknown as MetadataClaimProcessorService

    const service = new ImportJobItemRunnerService(importStrategyFactory, importJobItemRepository, metadataClaimProcessorService)

    return {
      service,
      importStrategyFactory,
      importJobItemRepository,
      metadataClaimProcessorService,
    }
  }

  it('should persist staged asset paths on completion', async () => {
    // Arrange
    const { service, importStrategyFactory, importJobItemRepository, metadataClaimProcessorService } = createService()
    const ingestResult = {
      sourceItemRef: 'track-1',
      claims: [
        {
          field: MetadataClaimField.Title,
          value: 'Song',
          sourceAttribute: 'youtube.title',
          extractor: 'yt-dlp',
          confidence: MetadataConfidence.High,
        },
      ],
      assets: {
        audioPath: '/tmp/song.mp3',
        artworkPath: '/tmp/song.png',
      },
    }
    vi.mocked(importStrategyFactory.create).mockReturnValue({
      ingestTrack: vi.fn().mockResolvedValue(ingestResult),
    } as never)
    vi.mocked(importJobItemRepository.update).mockResolvedValue({} as never)

    // Act
    await service.run({
      jobItemId: 'job-item-1',
      sourceItemRef: 'track-1',
      dataSource: 'youtube',
      userId: 'user-1',
    })

    // Assert
    expect(metadataClaimProcessorService.process).toHaveBeenCalledTimes(1)
    expect(importJobItemRepository.update).toHaveBeenCalledWith(
      'job-item-1',
      expect.objectContaining({
        status: ImportStatus.Completed,
        audioPath: ingestResult.assets.audioPath,
        artworkPath: ingestResult.assets.artworkPath,
      }),
    )
  })

  it('should persist failure status and bounded error message', async () => {
    // Arrange
    const { service, importStrategyFactory, importJobItemRepository } = createService()
    vi.mocked(importStrategyFactory.create).mockReturnValue({
      ingestTrack: vi.fn().mockRejectedValue(new Error('x'.repeat(300))),
    } as never)
    vi.mocked(importJobItemRepository.update).mockResolvedValue({} as never)

    // Act
    await service.run({
      jobItemId: 'job-item-1',
      sourceItemRef: 'track-1',
      dataSource: 'youtube',
      userId: 'user-1',
    })

    // Assert
    expect(importJobItemRepository.update).toHaveBeenCalledWith(
      'job-item-1',
      expect.objectContaining({
        status: ImportStatus.Failed,
        errorMessage: 'x'.repeat(255),
      }),
    )
  })
})
