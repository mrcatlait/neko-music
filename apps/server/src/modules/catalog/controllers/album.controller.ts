import { Body, Controller, Get, Param, Post, Session } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Permissions } from '@neko/permissions'

import { AlbumCreationRequest, AlbumResponse } from '../dtos'
import { CreateAlbumUseCase, GetTracksForAlbumUseCase } from '../use-cases'

import { UploadTokenDto } from '@/modules/media/dtos'
import { MediaType, EntityType } from '@/modules/media/enums'
import { User } from '@/modules/auth/interfaces'
import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'
import { RequirePermissions } from '@/modules/auth/decorators'

@Controller('catalog/albums')
@ApiTags('Albums')
@ApiBearerAuth()
export class AlbumController {
  constructor(
    private readonly createAlbumUseCase: CreateAlbumUseCase,
    private readonly getTracksForAlbumUseCase: GetTracksForAlbumUseCase,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
  ) {}

  @Post('')
  @RequirePermissions(Permissions.Album.Write)
  @ApiOperation({
    summary: 'Create an album',
  })
  @ApiOkResponse({
    type: AlbumResponse,
  })
  createAlbum(@Body() body: AlbumCreationRequest): Promise<AlbumResponse> {
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
  // @ApiOkResponse({
  //   type: [TrackResponse],
  // })
  getTracksForAlbum(@Param('albumId') albumId: string): Promise<any[]> {
    return this.getTracksForAlbumUseCase.invoke({ id: albumId })
  }

  @Get(':albumId/upload-token')
  @RequirePermissions(Permissions.Album.Write)
  @ApiOperation({
    summary: 'Get an upload token for an album',
  })
  @ApiOkResponse({
    type: UploadTokenDto,
  })
  getUploadToken(@Param('albumId') albumId: string, @Session() user: User): Promise<UploadTokenDto> {
    /**
     * @todo create use case for this
     */
    return this.generateUploadTokenUseCase.invoke({
      userId: user.id,
      mediaType: MediaType.ARTWORK,
      entityType: EntityType.ALBUM,
      entityId: albumId,
    })
  }
}
