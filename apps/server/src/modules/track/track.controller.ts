import { Controller, Get, HttpStatus, Param, Query, StreamableFile, ValidationPipe } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { TrackService } from './track.service'
import { TracksPageOptionsDto, TracksPageDto } from './dto'

@Controller('tracks')
@ApiTags('Tracks')
export class TrackController {
  constructor(private readonly service: TrackService) {}

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

  @Get('/:trackId/stream/:filename')
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  stream(@Param('trackId') trackId: string, @Param('filename') filename: string): StreamableFile {
    return this.service.stream(trackId, filename)
  }
}
