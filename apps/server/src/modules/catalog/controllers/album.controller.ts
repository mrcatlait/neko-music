import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { GetTracksForAlbumUseCase } from '../use-cases'

@Controller('catalog/albums')
@ApiTags('Albums')
@ApiBearerAuth()
export class AlbumController {
  constructor(private readonly getTracksForAlbumUseCase: GetTracksForAlbumUseCase) {}

  @Get(':albumId/tracks')
  @ApiOperation({
    summary: 'Get tracks for an album',
  })
  getTracksForAlbum(@Param('albumId') albumId: string): Promise<any[]> {
    return this.getTracksForAlbumUseCase.invoke({ id: albumId })
  }
}
