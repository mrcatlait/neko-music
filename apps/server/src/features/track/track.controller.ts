import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  StreamableFile,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { File, FileFieldsInterceptor } from '@nest-lab/fastify-multer'

import { TrackService } from './track.service'
import { TrackDto, TracksPageOptionsDto, TracksPageDto, CreateTrackDto } from './dto'

import { Roles } from '@core/decorators'
import { Role } from '@core/models'
import { Public } from '@features/auth/decorators'

@Controller('tracks')
@ApiTags('Tracks')
@ApiBearerAuth()
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

  @Get('/:trackId')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: TrackDto,
  })
  trackById(@Param('trackId') trackId: string): Promise<TrackDto> {
    return this.service.getTrackById(trackId)
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

  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    type: TrackDto,
  })
  @ApiConsumes('multipart/form-data')
  @Roles(Role.Admin)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  createArtist(
    @Body() input: CreateTrackDto,
    @UploadedFiles() files: { image: File[]; video: File[] },
  ): Promise<TrackDto> {
    return this.service.createTrack(input, files.image[0], files.video[0])
  }

  @Get('/:trackId/stream/:filename')
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  @Public()
  stream(@Param('trackId') trackId: string, @Param('filename') filename: string): StreamableFile {
    return this.service.stream(trackId, filename)
  }
}
