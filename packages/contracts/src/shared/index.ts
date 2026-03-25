import { AlbumTypeEnum } from './album-type.enum'
import { ArtistRoleDto } from './artist-role.dto'
import { ArtistRoleEnum } from './artist-role.enum'
import { ArtworkDto } from './artwork.dto'
import { TrackTypeEnum } from './track-type.enum'
import { PagePaginationMetadata as PagePaginationMetadataDto } from './page-pagination-metadata'
import { ListResponse as ListResponseDto } from './list-response'

export namespace SharedDtos {
  export namespace Enums {
    export type AlbumType = AlbumTypeEnum
    export const AlbumType = AlbumTypeEnum
    export type ArtistRole = ArtistRoleEnum
    export const ArtistRole = ArtistRoleEnum
    export type TrackType = TrackTypeEnum
    export const TrackType = TrackTypeEnum
  }

  export namespace Dtos {
    export type Artwork = ArtworkDto
    export type ArtistRole = ArtistRoleDto
    export type PagePaginationMetadata = PagePaginationMetadataDto
    export type ListResponse<T> = ListResponseDto<T>
  }
}
