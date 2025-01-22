import { PageOptionsDto } from '@common/dtos'
import { Handler } from '@common/models'

export interface GetCollectionMembershipQueryParams {
  userId: string
  collectionId: string
  collectionType: CollectionType
  pageOptionsDto: PageOptionsDto
}

export class GetCollectionMembershipQuery
  implements Handler<GetCollectionMembershipQueryParams, CollectionMembershipPageDto>
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
