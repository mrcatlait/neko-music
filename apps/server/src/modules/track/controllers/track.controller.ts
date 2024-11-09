import { Controller, Get, HttpStatus, Param, Query, StreamableFile, ValidationPipe } from '@nestjs/common'
import { ApiOkResponse, ApiProduces, ApiTags } from '@nestjs/swagger'

import { TrackService, TrackStreamingService } from '../services'
import { TracksPageOptionsDto, TracksPageDto } from '../dto'

@Controller('tracks')
@ApiTags('Tracks')
export class TrackController {
  constructor(
    private readonly service: TrackService,
    private readonly streamingService: TrackStreamingService,
  ) {}

  @Get('')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: TracksPageDto,
  })
  tracks(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: TracksPageOptionsDto,
  ): Promise<TracksPageDto> {
    return this.service.getTracks(pageOptionsDto)
  }

  @Get('/popular')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: TracksPageDto,
  })
  popularTracks(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: TracksPageOptionsDto,
  ): Promise<TracksPageDto> {
    return this.service.getPopularTracks(pageOptionsDto)
  }

  @Get('/new')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: TracksPageDto,
  })
  newTracks(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: TracksPageOptionsDto,
  ): Promise<TracksPageDto> {
    return this.service.getNewTracks(pageOptionsDto)
  }

  @Get('/:trackId/stream/manifest.mpd')
  @ApiProduces('application/dash+xml')
  @ApiOkResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  streamManifest(@Param('trackId') trackId: string): StreamableFile {
    return this.streamingService.streamManifest(trackId)
  }

  @Get('/:trackId/stream/:segmentId')
  @ApiProduces('application/dash+xml')
  @ApiOkResponse({
    status: HttpStatus.OK,
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  streamSegment(@Param('trackId') trackId: string, @Param('segmentId') segmentId: string): StreamableFile {
    return this.streamingService.streamSegment(trackId, segmentId)
  }
}
