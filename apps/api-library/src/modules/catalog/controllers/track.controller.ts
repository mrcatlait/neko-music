import { Controller, Get, Param, Put, Body, Post, UseGuards } from '@nestjs/common'
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { TrackCreationRequest, TrackResponse } from '../dtos'
import { CreateTrackUseCase } from '../use-cases'

import { UserSession } from '@/modules/auth/interfaces'
import { UploadTokenDto } from '@/modules/media/dtos'
import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'
import { EntityType, MediaType } from '@/modules/media/enums'
import { AuthGuard } from '@/modules/auth/guards'
import { Session } from '@/modules/auth/decorators'

@Controller('tracks')
@ApiTags('Tracks')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class TrackController {
  constructor(
    private readonly createTrackUseCase: CreateTrackUseCase,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
  ) {}

  @Post('')
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
  @ApiOperation({
    summary: 'Get an upload token for a track',
  })
  @ApiOkResponse({
    type: UploadTokenDto,
  })
  getUploadToken(@Param('trackId') trackId: string, @Session() session: UserSession): Promise<UploadTokenDto> {
    return this.generateUploadTokenUseCase.invoke({
      entityType: EntityType.TRACK,
      entityId: trackId,
      userId: session.userId,
      mediaType: MediaType.AUDIO,
    })
  }
}
