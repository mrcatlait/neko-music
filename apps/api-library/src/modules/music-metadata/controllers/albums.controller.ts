import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth } from '@nestjs/swagger'
import { QueryBus } from '@nestjs/cqrs'
import { AuthGuard } from '@modules/authentication/guards'

import { AlbumWithArtistsEntity } from '../entities'
import { GetPopularAlbumsQuery } from '../queries'

@Controller('albums')
@ApiTags('Albums')
@ApiCookieAuth()
// @UseGuards(AuthGuard)
export class AlbumsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('popular')
  @ApiOperation({
    summary: 'Get popular albums',
  })
  getPopularAlbums(): Promise<AlbumWithArtistsEntity[]> {
    return this.queryBus.execute(new GetPopularAlbumsQuery())
  }
}
