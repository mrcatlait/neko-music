import { Controller, Get, HttpStatus, Param, Query, ValidationPipe } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { ArtistByIdDto, ArtistDto } from './dto'
import { ArtistService } from './artist.service'

import { TracksPageDto, TracksPageOptionsDto } from '@features/track/dto'
import { TrackService } from '@features/track/track.service'

@Controller('artists')
@ApiTags('Artists')
@ApiBearerAuth()
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
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: TracksPageOptionsDto,
  ): Promise<TracksPageDto> {
    return this.trackService.getArtistTracks(params.artistId, pageOptionsDto)
  }
}
