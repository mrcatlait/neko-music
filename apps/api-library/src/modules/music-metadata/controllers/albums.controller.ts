import { Body, Controller, Get, Param, Post, Session, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

import { GetPopularAlbumsQuery, GetTracksForAlbumQuery } from '../queries'
import { AlbumDto, AlbumWithArtistsAndArtworkDto, TrackWithAlbumAndArtistsAndArtworkDto } from '../dtos'
import { CreateAlbumDto } from '../dtos/create-album.dto'
import { CreateAlbumCommand } from '../commands'

import { AuthGuard } from '@modules/authentication/guards'
import { UploadTokenDto } from '@modules/media/dtos'
import { GenerateUploadTokenCommand } from '@modules/media/commands'
import { MediaType, EntityType } from '@modules/media/enums'
import { UserSession } from '@modules/authentication/interfaces'

@Controller('albums')
@ApiTags('Albums')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class AlbumsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

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

  @Post('')
  @ApiOperation({
    summary: 'Create an album',
  })
  @ApiOkResponse({
    type: AlbumDto,
  })
  createAlbum(@Body() body: CreateAlbumDto): Promise<AlbumDto> {
    return this.commandBus.execute(
      new CreateAlbumCommand(
        body.name,
        new Date(body.releaseDate),
        body.explicit,
        body.type,
        body.genres,
        body.artists,
      ),
    )
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

  @Get(':albumId/upload-token')
  @ApiOperation({
    summary: 'Get an upload token for an album',
  })
  @ApiOkResponse({
    type: UploadTokenDto,
  })
  getUploadToken(@Param('albumId') albumId: string, @Session() session: UserSession): Promise<UploadTokenDto> {
    return this.commandBus.execute(
      new GenerateUploadTokenCommand(session.userId, MediaType.ARTWORK, EntityType.ALBUM, albumId),
    )
  }
}
