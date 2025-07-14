import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'

import { GetPopularAlbumsQuery } from '../queries'
import { AlbumWithArtistsDto } from '../dtos'

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
    type: [AlbumWithArtistsDto],
  })
  getPopularAlbums(): Promise<AlbumWithArtistsDto[]> {
    return this.queryBus.execute(new GetPopularAlbumsQuery())
  }

  @Get(':albumId/tracks')
  @ApiOperation({
    summary: 'Get tracks for an album',
  })
  @ApiOkResponse({
    type: [TrackDto],
  })
  getTracksForAlbum(@Param('albumId') albumId: string): Promise<TrackDto[]> {
    return this.queryBus.execute(new GetTracksForAlbumQuery(albumId))
  }
}
