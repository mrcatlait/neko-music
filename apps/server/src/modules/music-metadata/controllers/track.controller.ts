import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { GetNewTracksHandler, GetPopularTracksHandler } from '../queries'
import { TracksPageDto } from '../dtos'

@Controller('tracks')
export class TrackController {
  constructor(
    private readonly getNewTracksHandler: GetNewTracksHandler,
    private readonly getPopularTracksHandler: GetPopularTracksHandler,
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
}
