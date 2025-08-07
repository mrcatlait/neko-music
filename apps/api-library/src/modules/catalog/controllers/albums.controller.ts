import { Body, Controller, Get, Param, Post, Session, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger'

import { CreateAlbumDto } from '../dtos/create-album.dto'
import { AlbumDto, AlbumWithArtistsAndArtworkDto, TrackWithAlbumAndArtistsAndArtworkDto } from '../dtos'
import { CreateAlbumUseCase, GetPopularAlbumsUseCase, GetTracksForAlbumUseCase } from '../use-cases'

import { AuthGuard } from '@/modules/auth/guards'
import { UploadTokenDto } from '@/modules/media/dtos'
import { MediaType, EntityType } from '@/modules/media/enums'
import { UserSession } from '@/modules/auth/interfaces'
import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'

@Controller('albums')
@ApiTags('Albums')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class AlbumsController {
  constructor(
    private readonly createAlbumUseCase: CreateAlbumUseCase,
    private readonly getPopularAlbumsUseCase: GetPopularAlbumsUseCase,
    private readonly getTracksForAlbumUseCase: GetTracksForAlbumUseCase,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
  ) {}

  @Get('popular')
  @ApiOperation({
    summary: 'Get popular albums',
  })
  @ApiOkResponse({
    type: [AlbumWithArtistsAndArtworkDto],
  })
  getPopularAlbums(): Promise<AlbumWithArtistsAndArtworkDto[]> {
    return this.getPopularAlbumsUseCase.invoke()
  }

  @Post('')
  @ApiOperation({
    summary: 'Create an album',
  })
  @ApiOkResponse({
    type: AlbumDto,
  })
  createAlbum(@Body() body: CreateAlbumDto): Promise<AlbumDto> {
    return this.createAlbumUseCase.invoke({
      name: body.name,
      releaseDate: new Date(body.releaseDate),
      explicit: body.explicit,
      type: body.type,
      genres: body.genres,
      artists: body.artists,
    })
  }

  @Get(':albumId/tracks')
  @ApiOperation({
    summary: 'Get tracks for an album',
  })
  @ApiOkResponse({
    type: [TrackWithAlbumAndArtistsAndArtworkDto],
  })
  getTracksForAlbum(@Param('albumId') albumId: string): Promise<TrackWithAlbumAndArtistsAndArtworkDto[]> {
    return this.getTracksForAlbumUseCase.invoke({ id: albumId })
  }

  @Get(':albumId/upload-token')
  @ApiOperation({
    summary: 'Get an upload token for an album',
  })
  @ApiOkResponse({
    type: UploadTokenDto,
  })
  getUploadToken(@Param('albumId') albumId: string, @Session() session: UserSession): Promise<UploadTokenDto> {
    return this.generateUploadTokenUseCase.invoke({
      userId: session.userId,
      mediaType: MediaType.ARTWORK,
      entityType: EntityType.ALBUM,
      entityId: albumId,
    })
  }
}
