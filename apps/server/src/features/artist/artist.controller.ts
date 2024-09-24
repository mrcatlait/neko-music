import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor, File } from '@nest-lab/fastify-multer'

import { ArtistByIdDto, ArtistDto, ArtistsPageDto, ArtistsPageOptionsDto, CreateArtistDto } from './dto'
import { ArtistService } from './artist.service'

import { Roles } from '@core/decorators'
import { Role } from '@core/models'
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

  @Get('')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ArtistsPageDto,
  })
  artists(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: ArtistsPageOptionsDto,
  ): Promise<ArtistsPageDto> {
    return this.service.getArtists(pageOptionsDto)
  }

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

  @Get('/popular')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: ArtistsPageDto,
  })
  popularArtists(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: ArtistsPageOptionsDto,
  ): Promise<ArtistsPageDto> {
    return this.service.getPopularArtists(pageOptionsDto)
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    type: ArtistDto,
  })
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('image'))
  createArtist(@Body() input: CreateArtistDto, @UploadedFile() file: File): Promise<ArtistDto> {
    return this.service.createArtist(input, file)
  }
}
