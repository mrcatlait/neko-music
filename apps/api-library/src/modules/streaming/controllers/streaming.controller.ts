import { Controller, Get, Param, StreamableFile } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiProduces } from '@nestjs/swagger'

import { StreamingService } from '../services'

@Controller('stream')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Get(':trackId/manifest')
  @ApiOperation({
    summary: 'Get track manifest',
  })
  @ApiOkResponse({
    type: String,
  })
  @ApiProduces('application/dash+xml')
  streamManifest(@Param('trackId') trackId: string): StreamableFile {
    return this.streamingService.streamManifest(trackId)
  }

  @Get(':trackId/:segmentId')
  @ApiOperation({
    summary: 'Get track segment',
  })
  @ApiOkResponse({
    type: String,
  })
  @ApiProduces('video/iso.segment')
  streamSegment(@Param('trackId') trackId: string, @Param('segmentId') segmentId: string): StreamableFile {
    return this.streamingService.streamSegment(trackId, segmentId)
  }
}
