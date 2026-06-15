import { ImportUseCase } from './import.use-case'
import { ImportStatus } from '../../enums'
import { ImportJobItemRepository, ImportJobRepository } from '../../repositories'
import { ImportStrategyFactory } from '../../strategies'
import { ImportValidator } from './import.validator'

describe('ImportUseCase', () => {
  it('should mark hard-duplicate canonical refs as completed', async () => {
    // Arrange
    const importValidator = {
      validate: vi.fn().mockResolvedValue(undefined),
    } as unknown as ImportValidator
    const importStrategyFactory = {
      create: vi.fn().mockReturnValue({
        normalizeSourceRef: vi.fn((value: string) => value),
        normalizeSourceItemRef: vi.fn((value: string) => value),
        discoverTracks: vi.fn().mockResolvedValue({
          label: 'My Playlist',
          tracks: [
            { sourceItemRef: 'track-1', label: 'Track 1' },
            { sourceItemRef: 'track-2', label: 'Track 2' },
          ],
        }),
      }),
    } as unknown as ImportStrategyFactory
    const importJobRepository = {
      create: vi.fn().mockResolvedValue({
        id: 'job-1',
      }),
    } as unknown as ImportJobRepository
    const importJobItemRepository = {
      findExistingCanonicalRefs: vi.fn().mockResolvedValue(new Set(['track-1'])),
      createMany: vi.fn().mockResolvedValue([]),
    } as unknown as ImportJobItemRepository

    const useCase = new ImportUseCase(
      importValidator,
      importStrategyFactory,
      importJobRepository,
      importJobItemRepository,
      {} as never,
    )

    // Act
    const result = await useCase.invoke({
      dataSource: 'youtube',
      sourceRef: 'https://youtube.com/playlist?list=abc',
      userId: 'user-1',
    })

    // Assert
    expect(importJobItemRepository.createMany).toHaveBeenCalledWith([
      {
        jobId: 'job-1',
        status: ImportStatus.Completed,
        sourceItemRef: 'track-1',
        label: 'Track 1',
        errorMessage: 'hard_duplicate',
      },
      {
        jobId: 'job-1',
        status: ImportStatus.Pending,
        sourceItemRef: 'track-2',
        label: 'Track 2',
        errorMessage: null,
      },
    ])
    expect(result).toEqual({ id: 'job-1' })
  })
})
