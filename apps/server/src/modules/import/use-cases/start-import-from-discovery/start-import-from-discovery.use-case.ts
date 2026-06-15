import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'

import { ImportStatus } from '../../enums'
import { ImportDiscoveryItemRepository, ImportDiscoveryRepository, ImportJobItemRepository, ImportJobRepository } from '../../repositories'
import { IMPORT_MODULE_OPTIONS } from '../../tokens'
import { ImportModuleOptions } from '../../module-options'

import { UseCase } from '@/modules/shared/types'

export interface StartImportFromDiscoveryUseCaseParams {
  discoveryId: string
  selectedItemIds: string[]
  userId: string
}

export interface StartImportFromDiscoveryUseCaseResult {
  id: string
}

@Injectable()
export class StartImportFromDiscoveryUseCase
  implements UseCase<StartImportFromDiscoveryUseCaseParams, StartImportFromDiscoveryUseCaseResult>
{
  private static readonly HARD_DUPLICATE_MESSAGE = 'hard_duplicate'

  constructor(
    private readonly importDiscoveryRepository: ImportDiscoveryRepository,
    private readonly importDiscoveryItemRepository: ImportDiscoveryItemRepository,
    private readonly importJobRepository: ImportJobRepository,
    private readonly importJobItemRepository: ImportJobItemRepository,
    @Inject(IMPORT_MODULE_OPTIONS)
    private readonly importModuleOptions: ImportModuleOptions,
  ) {}

  async invoke(params: StartImportFromDiscoveryUseCaseParams): Promise<StartImportFromDiscoveryUseCaseResult> {
    const existingJob = await this.importJobRepository.findByDiscoveryId(params.discoveryId)

    if (existingJob) {
      return { id: existingJob.id }
    }

    if (params.selectedItemIds.length === 0) {
      throw new BadRequestException('At least one import item must be selected')
    }

    const discovery = await this.importDiscoveryRepository.findOne(params.discoveryId)

    if (!discovery) {
      throw new NotFoundException('Import discovery not found')
    }

    const discoveryTtlDays = this.importModuleOptions.discoveryTtlDays

    if (discoveryTtlDays && discovery.createdAt) {
      const discoveryExpirationDate = new Date(discovery.createdAt)
      discoveryExpirationDate.setDate(discoveryExpirationDate.getDate() + discoveryTtlDays)

      if (discoveryExpirationDate.getTime() < Date.now()) {
        throw new BadRequestException('Import discovery has expired, refresh discovery first')
      }
    }

    const discoveryItems = await this.importDiscoveryItemRepository.findMany({
      discoveryId: params.discoveryId,
    })
    const selectedItemIdSet = new Set(params.selectedItemIds)
    const discoveryItemIdSet = new Set(discoveryItems.map((item) => item.id))

    if (params.selectedItemIds.some((selectedItemId) => !discoveryItemIdSet.has(selectedItemId))) {
      throw new BadRequestException('Selected import items do not belong to discovery')
    }

    await this.importDiscoveryItemRepository.setSelection(params.discoveryId, params.selectedItemIds)

    const selectedItems = discoveryItems.filter((item) => selectedItemIdSet.has(item.id))

    const importJob = await this.importJobRepository.create({
      discoveryId: discovery.id,
      dataSource: discovery.dataSource,
      sourceRef: discovery.sourceRef,
      status: ImportStatus.Pending,
      label: discovery.label,
      createdBy: params.userId,
    })

    const existingCanonicalRefs = await this.importJobItemRepository.findExistingCanonicalRefs(
      discovery.dataSource,
      selectedItems.map((item) => item.sourceItemRef),
    )

    await this.importJobItemRepository.createMany(
      selectedItems.map((item) => ({
        jobId: importJob.id,
        status: existingCanonicalRefs.has(item.sourceItemRef) ? ImportStatus.Completed : ImportStatus.Pending,
        sourceItemRef: item.sourceItemRef,
        label: item.label,
        errorMessage: existingCanonicalRefs.has(item.sourceItemRef)
          ? StartImportFromDiscoveryUseCase.HARD_DUPLICATE_MESSAGE
          : null,
      })),
    )

    return { id: importJob.id }
  }
}
