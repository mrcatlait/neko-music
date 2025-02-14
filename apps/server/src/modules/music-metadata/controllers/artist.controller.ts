import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { GetArtistHandler, GetArtistTracksHandler } from '../queries'
import { ArtistDto, GetArtistDto, TracksPageDto, CreateArtistDto } from '../dtos'
import { CreateArtistHandler } from '../commands'

@Controller('artist')
@ApiTags('Artists')
export class ArtistController {
  constructor(
    private readonly getArtistHandler: GetArtistHandler,
    private readonly getArtistTracksHandler: GetArtistTracksHandler,
    private readonly createArtistHandler: CreateArtistHandler,
  ) {}

  @Get(':artistId')
  @ApiOperation({
    summary: 'Get an artist by its ID',
  })
  @ApiOkResponse({
    type: ArtistDto,
  })
  getArtist(@Param() params: GetArtistDto): Promise<ArtistDto> {
    return this.getArtistHandler.handle({ id: params.artistId })
  }

  @Get(':artistId/tracks')
  @ApiOperation({
    summary: 'Get an artist tracks by its ID',
  })
  @ApiOkResponse({
    type: TracksPageDto,
  })
  getArtistTracks(@Param() params: GetArtistDto): Promise<TracksPageDto> {
    return this.getArtistTracksHandler.handle({ artistId: params.artistId })
  }

  @Post('')
  @ApiOperation({
    summary: 'Create an artist',
  })
  @ApiOkResponse({
    type: ArtistDto,
  })
  createArtist(@Body() body: CreateArtistDto): Promise<ArtistDto> {
    return this.createArtistHandler.handle(body)
  }
}
