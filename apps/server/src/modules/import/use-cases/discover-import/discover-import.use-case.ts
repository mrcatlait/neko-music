import { BadRequestException, Injectable } from '@nestjs/common'

import { ImportStrategyFactory } from '../../strategies'
import { ImportDiscoveryItemRepository, ImportDiscoveryRepository } from '../../repositories'
import { ImportDiscovery } from '../../models'

import { UseCase } from '@/modules/shared/types'

export interface DiscoverImportUseCaseParams {
  dataSource: string
  sourceRef: string
  userId: string
}

@Injectable()
export class DiscoverImportUseCase implements UseCase<DiscoverImportUseCaseParams, ImportDiscovery> {
  constructor(
    private readonly importStrategyFactory: ImportStrategyFactory,
    private readonly importDiscoveryRepository: ImportDiscoveryRepository,
    private readonly importDiscoveryItemRepository: ImportDiscoveryItemRepository,
  ) {}

  async invoke(params: DiscoverImportUseCaseParams): Promise<ImportDiscovery> {
    const strategy = this.importStrategyFactory.create(params.dataSource)
    const canonicalSourceRef = strategy.normalizeSourceRef(params.sourceRef)
    const validInput = strategy.validateSourceRef(canonicalSourceRef)

    if (!validInput) {
      throw new BadRequestException('Invalid import target')
    }

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
      dataSource: params.dataSource,
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
      })),
    )

    return {
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
    }
  }
}
