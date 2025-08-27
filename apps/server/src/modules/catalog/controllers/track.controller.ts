import { Controller, Get, Param, Body, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Permissions } from '@neko/permissions'

import { TrackCreationRequest, TrackResponse } from '../dtos'
import { CreateTrackUseCase } from '../use-cases'

import { UploadTokenDto } from '@/modules/media/dtos'
import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'
import { EntityType, MediaType } from '@/modules/media/enums'
import { RequirePermissions, Session } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'

@Controller('tracks')
@ApiTags('Tracks')
@ApiBearerAuth()
export class TrackController {
  constructor(
    private readonly createTrackUseCase: CreateTrackUseCase,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
  ) {}

  @Post('')
  @RequirePermissions(Permissions.Track.Write)
  @ApiOperation({
    summary: 'Create a track',
  })
  @ApiOkResponse({
    type: TrackResponse,
  })
  createTrack(@Body() body: TrackCreationRequest): Promise<TrackResponse> {
    return this.createTrackUseCase.invoke({
      name: body.name,
      duration: body.duration,
      explicit: body.explicit,
      genres: body.genres,
      artists: body.artists,
      album: body.album,
      releaseDate: new Date(body.releaseDate),
      diskNumber: body.diskNumber,
      trackNumber: body.trackNumber,
    })
  }

  // @Put(':trackId/status')
  // @ApiOperation({
  //   summary: 'Update publishing status of a track',
  // })
  // @ApiOkResponse({
  //   type: TrackResponse,
  // })
  // reviewTrack(@Param('trackId') trackId: string, @Body() body: TrackReviewRequest): Promise<TrackResponse> {
  //   return this.updateTrackStatusUseCase.invoke({ id: trackId, status: body.status })
  // }

  @Get(':trackId/upload-token')
  @RequirePermissions(Permissions.Track.Write)
  @ApiOperation({
    summary: 'Get an upload token for a track',
  })
  @ApiOkResponse({
    type: UploadTokenDto,
  })
  getUploadToken(@Param('trackId') trackId: string, @Session() user: User): Promise<UploadTokenDto> {
    return this.generateUploadTokenUseCase.invoke({
      entityType: EntityType.TRACK,
      entityId: trackId,
      userId: user.id,
      mediaType: MediaType.AUDIO,
    })
  }
}
