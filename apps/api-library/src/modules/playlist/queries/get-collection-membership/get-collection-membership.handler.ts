import { Injectable } from '@nestjs/common'

import { GetCollectionMembershipQuery } from './get-collection-membership.query'
import { CollectionMembershipPageDto } from '../../dto'
import { PlaylistRepository } from '../../repositories'
import { TrackResolverService } from '../../services'

import { QueryHandler } from '@modules/shared/models'
import { PageMetaDto } from '@modules/shared/dtos'

@Injectable()
export class GetCollectionMembershipHandler
  implements QueryHandler<GetCollectionMembershipQuery, CollectionMembershipPageDto>
{
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly trackResolverService: TrackResolverService,
  ) {}

  async handle(query: GetCollectionMembershipQuery): Promise<CollectionMembershipPageDto> {
    const [trackIds, playlistsResult] = await Promise.all([
      this.trackResolverService.resolveTrackIds(query.collectionId, query.collectionType),
      this.playlistRepository.getItemsWithTrackIds(query.userId, query.pageOptionsDto),
    ])

    return new CollectionMembershipPageDto(
      playlistsResult.data.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        membership: {
          total: trackIds.length,
          existing: trackIds.filter((trackId) => playlist.tracks?.includes(trackId)).length,
        },
      })),
      new PageMetaDto({
        pageOptionsDto: query.pageOptionsDto,
        hasMore: playlistsResult.hasMore,
      }),
    )
  }
}
