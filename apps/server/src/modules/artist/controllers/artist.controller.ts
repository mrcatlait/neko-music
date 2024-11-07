import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { ArtistByIdDto, ArtistDto } from '../dto'
import { ArtistService } from '../services'

import { TrackService } from '@modules/track/services'
import { TracksPageDto, TracksPageOptionsDto } from '@modules/track/dto'

@Controller('artists')
@ApiTags('Artists')
export class ArtistsController {
  constructor(
    private readonly service: ArtistService,
    private readonly trackService: TrackService,
  ) {}

  @Get('/:artistId')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ArtistDto,
  })
  artistById(@Param() params: ArtistByIdDto): Promise<ArtistDto> {
    return this.service.getArtist(params.artistId)
  }

  @Get('/:artistId/tracks')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: TracksPageDto,
  })
  tracksByArtistId(
    @Param() params: ArtistByIdDto,
    @Query() pageOptionsDto: TracksPageOptionsDto,
  ): Promise<TracksPageDto> {
    return this.trackService.getArtistTracks(params.artistId, pageOptionsDto)
  }
}
