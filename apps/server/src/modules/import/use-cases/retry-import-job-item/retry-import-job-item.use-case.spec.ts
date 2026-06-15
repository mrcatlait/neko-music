import { BadRequestException, NotFoundException } from '@nestjs/common'

import { RetryImportJobItemUseCase } from './retry-import-job-item.use-case'
import { ImportStatus } from '../../enums'
import { ImportJobItemRepository, ImportJobItemRetryHistoryRepository, ImportJobRepository } from '../../repositories'

describe('RetryImportJobItemUseCase', () => {
  const createUseCase = () => {
    const importJobItemRepository = {
      findOne: vi.fn(),
      update: vi.fn(),
    } as unknown as ImportJobItemRepository
    const importJobItemRetryHistoryRepository = {
      create: vi.fn(),
    } as unknown as ImportJobItemRetryHistoryRepository
    const importJobRepository = {
      update: vi.fn(),
    } as unknown as ImportJobRepository

    const useCase = new RetryImportJobItemUseCase(
      importJobItemRepository,
      importJobItemRetryHistoryRepository,
      importJobRepository,
    )

    return {
      useCase,
      importJobItemRepository,
      importJobItemRetryHistoryRepository,
      importJobRepository,
    }
  }

  it('should retry failed item and append retry history', async () => {
    // Arrange
    const { useCase, importJobItemRepository, importJobItemRetryHistoryRepository, importJobRepository } = createUseCase()
    vi.mocked(importJobItemRepository.findOne).mockResolvedValue({
      id: 'item-1',
      jobId: 'job-1',
      status: ImportStatus.Failed,
      retryCount: 1,
      errorMessage: 'Initial failure',
    } as never)

    // Act
    const result = await useCase.invoke({
      importJobItemId: 'item-1',
      reason: 'Fixed source',
      userId: 'user-1',
    })

    // Assert
    expect(importJobItemRetryHistoryRepository.create).toHaveBeenCalledWith({
      importJobItemId: 'item-1',
      attemptNumber: 2,
      reason: 'Fixed source',
      errorMessage: 'Initial failure',
      createdBy: 'user-1',
    })
    expect(importJobItemRepository.update).toHaveBeenCalledWith(
      'item-1',
      expect.objectContaining({
        status: ImportStatus.Pending,
        retryCount: 2,
        lastRetriedBy: 'user-1',
      }),
    )
    expect(importJobRepository.update).toHaveBeenCalledWith(
      'job-1',
      expect.objectContaining({
        status: ImportStatus.Pending,
      }),
    )
    expect(result).toEqual({ id: 'item-1' })
  })

  it('should fail for non-failed item', async () => {
    // Arrange
    const { useCase, importJobItemRepository } = createUseCase()
    vi.mocked(importJobItemRepository.findOne).mockResolvedValue({
      id: 'item-1',
      status: ImportStatus.Completed,
    } as never)

    // Act & Assert
    await expect(
      useCase.invoke({
        importJobItemId: 'item-1',
        userId: 'user-1',
      }),
    ).rejects.toThrow(BadRequestException)
  })

  it('should fail when item does not exist', async () => {
    // Arrange
    const { useCase, importJobItemRepository } = createUseCase()
    vi.mocked(importJobItemRepository.findOne).mockResolvedValue(undefined)

    // Act & Assert
    await expect(
      useCase.invoke({
        importJobItemId: 'missing',
        userId: 'user-1',
      }),
    ).rejects.toThrow(NotFoundException)
  })
})
