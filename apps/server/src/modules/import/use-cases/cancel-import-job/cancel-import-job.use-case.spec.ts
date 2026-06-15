import { BadRequestException, NotFoundException } from '@nestjs/common'

import { CancelImportJobUseCase } from './cancel-import-job.use-case'
import { ImportStatus } from '../../enums'
import { ImportJobRepository } from '../../repositories'

describe('CancelImportJobUseCase', () => {
  let useCase: CancelImportJobUseCase
  let importJobRepository: ImportJobRepository

  beforeEach(() => {
    importJobRepository = {
      findOne: vi.fn(),
      update: vi.fn(),
    } as unknown as ImportJobRepository

    useCase = new CancelImportJobUseCase(importJobRepository)
  })

  it('should mark in-progress job as cancel requested', async () => {
    // Arrange
    vi.mocked(importJobRepository.findOne).mockResolvedValue({
      id: 'job-1',
      status: ImportStatus.InProgress,
    } as never)

    // Act
    const result = await useCase.invoke({
      jobId: 'job-1',
    })

    // Assert
    expect(importJobRepository.update).toHaveBeenCalledWith('job-1', {
      status: ImportStatus.CancelRequested,
    })
    expect(result).toEqual({ id: 'job-1' })
  })

  it('should throw when job is not found', async () => {
    // Arrange
    vi.mocked(importJobRepository.findOne).mockResolvedValue(undefined)

    // Act & Assert
    await expect(
      useCase.invoke({
        jobId: 'missing',
      }),
    ).rejects.toThrow(NotFoundException)
  })

  it('should throw when job is already terminal', async () => {
    // Arrange
    vi.mocked(importJobRepository.findOne).mockResolvedValue({
      id: 'job-1',
      status: ImportStatus.Completed,
    } as never)

    // Act & Assert
    await expect(
      useCase.invoke({
        jobId: 'job-1',
      }),
    ).rejects.toThrow(BadRequestException)
  })
})
