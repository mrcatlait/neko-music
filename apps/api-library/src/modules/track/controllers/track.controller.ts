import { Controller, Get, Param, StreamableFile } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiProduces } from '@nestjs/swagger'

import { GetNewTracksHandler, GetPopularTracksHandler } from '../queries'
import { TracksPageDto } from '../dtos'
import { TrackStreamingService } from '../services'

@Controller('tracks')
export class TrackController {
  constructor(
    private readonly getNewTracksHandler: GetNewTracksHandler,
    private readonly getPopularTracksHandler: GetPopularTracksHandler,
    private readonly trackStreamingService: TrackStreamingService,
  ) {}

  @Get('new')
  @ApiOperation({
    summary: 'Get new tracks',
  })
  @ApiOkResponse({ type: () => TracksPageDto })
  getNewTracks(): Promise<TracksPageDto> {
    return this.getNewTracksHandler.handle()
  }

  @Get('popular')
  @ApiOperation({
    summary: 'Get popular tracks',
  })
  @ApiOkResponse({ type: () => TracksPageDto })
  getPopularTracks(): Promise<TracksPageDto> {
    return this.getPopularTracksHandler.handle()
  }

  @Get(':trackId/stream/manifest')
  @ApiOperation({
    summary: 'Get track manifest',
  })
  @ApiOkResponse({
    type: String,
  })
  @ApiProduces('application/dash+xml')
  streamManifest(@Param('trackId') trackId: string) {
    return this.trackStreamingService.streamManifest(trackId)
  }

  @Get(':trackId/stream/:segmentId')
  @ApiOperation({
    summary: 'Get track segment',
  })
  @ApiOkResponse({
    type: String,
  })
  @ApiProduces('video/iso.segment')
  streamSegment(@Param('trackId') trackId: string, @Param('segmentId') segmentId: string) {
    return this.trackStreamingService.streamSegment(trackId, segmentId)
  }
}
