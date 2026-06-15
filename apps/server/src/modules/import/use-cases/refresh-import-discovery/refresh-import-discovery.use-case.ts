import { Injectable, NotFoundException } from '@nestjs/common'

import { ImportDiscoveryRefreshResult } from '../../models'
import { ImportDiscoveryItemRepository, ImportDiscoveryRepository } from '../../repositories'
import { ImportStrategyFactory } from '../../strategies'

import { UseCase } from '@/modules/shared/types'

export interface RefreshImportDiscoveryUseCaseParams {
  discoveryId: string
  userId: string
}

@Injectable()
export class RefreshImportDiscoveryUseCase
  implements UseCase<RefreshImportDiscoveryUseCaseParams, ImportDiscoveryRefreshResult>
{
  constructor(
    private readonly importDiscoveryRepository: ImportDiscoveryRepository,
    private readonly importDiscoveryItemRepository: ImportDiscoveryItemRepository,
    private readonly importStrategyFactory: ImportStrategyFactory,
  ) {}

  async invoke(params: RefreshImportDiscoveryUseCaseParams): Promise<ImportDiscoveryRefreshResult> {
    const previousDiscovery = await this.importDiscoveryRepository.findOne(params.discoveryId)

    if (!previousDiscovery) {
      throw new NotFoundException('Import discovery not found')
    }

    const previousItems = await this.importDiscoveryItemRepository.findMany({
      discoveryId: previousDiscovery.id,
    })
    const previouslySelectedRefs = new Set(
      previousItems.filter((item) => item.isSelected).map((item) => item.sourceItemRef),
    )

    const strategy = this.importStrategyFactory.create(previousDiscovery.dataSource)
    const canonicalSourceRef = strategy.normalizeSourceRef(previousDiscovery.sourceRef)
    const discoverResult = await strategy.discoverTracks(canonicalSourceRef)
    const canonicalTracks = Array.from(
      discoverResult.tracks
        .map((track) => ({
          sourceItemRef: strategy.normalizeSourceItemRef(track.sourceItemRef),
          label: track.label,
        }))
        .reduce((map, track) => {
          if (!map.has(track.sourceItemRef)) {
            map.set(track.sourceItemRef, track)
          }

          return map
        }, new Map<string, { sourceItemRef: string; label: string | undefined }>())
        .values(),
    )

    const discovery = await this.importDiscoveryRepository.create({
      dataSource: previousDiscovery.dataSource,
      sourceRef: canonicalSourceRef,
      label: discoverResult.label,
      createdBy: params.userId,
    })

    const tracks = await this.importDiscoveryItemRepository.createMany(
      canonicalTracks.map((track, position) => ({
        discoveryId: discovery.id,
        sourceItemRef: track.sourceItemRef,
        label: track.label || track.sourceItemRef,
        position,
        isSelected: previouslySelectedRefs.has(track.sourceItemRef),
      })),
    )

    const previousSourceRefSet = new Set(previousItems.map((item) => item.sourceItemRef))
    const refreshedSourceRefSet = new Set(tracks.map((item) => item.sourceItemRef))

    return {
      discovery: {
        id: discovery.id,
        dataSource: discovery.dataSource,
        sourceRef: discovery.sourceRef,
        label: discovery.label,
        tracks: tracks.map((track) => ({
          id: track.id,
          sourceItemRef: track.sourceItemRef,
          label: track.label,
          position: track.position,
          isSelected: track.isSelected,
        })),
      },
      newSourceItemRefs: tracks
        .map((track) => track.sourceItemRef)
        .filter((sourceItemRef) => !previousSourceRefSet.has(sourceItemRef)),
      removedSourceItemRefs: previousItems
        .map((track) => track.sourceItemRef)
        .filter((sourceItemRef) => !refreshedSourceRefSet.has(sourceItemRef)),
    }
  }
}
