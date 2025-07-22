import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'

import { GetPopularAlbumsQuery, GetTracksForAlbumQuery } from '../queries'
import { AlbumWithArtistsAndArtworkDto, TrackWithAlbumAndArtistsAndArtworkDto } from '../dtos'

import { AuthGuard } from '@modules/authentication/guards'

@Controller('albums')
@ApiTags('Albums')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class AlbumsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('popular')
  @ApiOperation({
    summary: 'Get popular albums',
  })
  @ApiOkResponse({
    type: [AlbumWithArtistsAndArtworkDto],
  })
  getPopularAlbums(): Promise<AlbumWithArtistsAndArtworkDto[]> {
    return this.queryBus.execute(new GetPopularAlbumsQuery())
  }

  @Get(':albumId/tracks')
  @ApiOperation({
    summary: 'Get tracks for an album',
  })
  @ApiOkResponse({
    type: [TrackWithAlbumAndArtistsAndArtworkDto],
  })
  getTracksForAlbum(@Param('albumId') albumId: string): Promise<TrackWithAlbumAndArtistsAndArtworkDto[]> {
    return this.queryBus.execute(new GetTracksForAlbumQuery(albumId))
  }
}
