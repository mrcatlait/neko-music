import { Injectable } from '@nestjs/common'
import { Loader } from 'mercurius'
import { Selectable } from 'kysely'

import { BackstageArtist } from '../models'
import { ArtistRepository } from '../repositories'
import { BackstageGenreTable } from '../../backstage.schema'
import { MediaStatus } from '../../shared/enums'

import { GetProcessingStatusUseCase } from '@/modules/media/use-cases'
import { EntityType, ProcessingStatus } from '@/modules/media/enums'

@Injectable()
export class ArtistLoader {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly getProcessingStatusUseCase: GetProcessingStatusUseCase,
  ) {}

  defaultLoader() {
    return {
      [BackstageArtist.name]: {
        genres: this.genres,
        mediaStatus: this.mediaStatus,
      },
    }
  }

  private readonly genres: Loader<BackstageArtist> = async (queries) => {
    const artistIds = queries.map(({ obj }) => obj.id)
    const artistGenres = await this.artistRepository.findManyGenres(artistIds)

    const byArtist = new Map<string, Selectable<BackstageGenreTable>[]>()

    for (const row of artistGenres) {
      let list = byArtist.get(row.artistId)

      if (!list) {
        list = []
        byArtist.set(row.artistId, list)
      }

      list.push({
        id: row.id,
        name: row.name,
        slug: row.slug,
        status: row.status,
        createdAt: row.createdAt,
        createdBy: row.createdBy,
        updatedAt: row.updatedAt,
        updatedBy: row.updatedBy,
      })
    }

    return queries.map(({ obj }) => byArtist.get(obj.id) ?? [])
  }

  private readonly mediaStatus: Loader<BackstageArtist> = async (queries) => {
    const artistIds = queries.map(({ obj }) => obj.id)
    const artistProcessingStatuses = await this.getProcessingStatusUseCase.invoke({
      entityType: EntityType.Artist,
      entityIds: artistIds,
    })

    const byArtist = new Map<string, MediaStatus>()

    for (const row of artistProcessingStatuses) {
      switch (row.status) {
        case ProcessingStatus.Pending:
          byArtist.set(row.entityId, MediaStatus.Empty)
          break
        case ProcessingStatus.Processing:
          byArtist.set(row.entityId, MediaStatus.Processing)
          break
        case ProcessingStatus.Completed:
          byArtist.set(row.entityId, MediaStatus.Ready)
          break
        case ProcessingStatus.Failed:
          byArtist.set(row.entityId, MediaStatus.Failed)
          break
      }
    }

    return queries.map(({ obj }) => byArtist.get(obj.id) ?? MediaStatus.Empty)
  }
}
