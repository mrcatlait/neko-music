import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { GetArtistHandler, GetArtistTracksHandler } from '../queries'
import { ArtistDto, GetArtistDto } from '../dtos'

import { TracksPageDto } from '@modules/track/dtos'

@Controller('artist')
@ApiTags('Artists')
export class ArtistController {
  constructor(
    private readonly getArtistHandler: GetArtistHandler,
    private readonly getArtistTracksHandler: GetArtistTracksHandler,
  ) {}

  @Get(':artistId')
  @ApiOperation({
    summary: 'Get an artist by its ID',
  })
  @ApiOkResponse({
    type: ArtistDto,
  })
  async getArtist(@Param() params: GetArtistDto): Promise<ArtistDto> {
    return this.getArtistHandler.handle({ id: params.artistId })
  }

  @Get(':artistId/tracks')
  @ApiOperation({
    summary: 'Get an artist tracks by its ID',
  })
  @ApiOkResponse({
    type: TracksPageDto,
  })
  async getArtistTracks(@Param() params: GetArtistDto): Promise<TracksPageDto> {
    return this.getArtistTracksHandler.handle({ artistId: params.artistId })
  }
}
