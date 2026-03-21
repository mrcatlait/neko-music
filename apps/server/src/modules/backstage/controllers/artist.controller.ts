import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { Permissions } from '@neko/permissions'

import {
  CreateBackstageArtistUseCase,
  GetArtistStatisticsUseCase,
  GetBackstageArtistsUseCase,
  GetBackstageArtistUseCase,
  UpdateBackstageArtistUseCase,
} from '../use-cases'
import {
  ArtistCreationRequest,
  ArtistCreationResponse,
  ArtistStatisticsResponse,
  ArtistUpdateRequest,
  ArtistUpdateResponse,
  ArtistDto,
} from '../dtos'

import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'
import { EntityType, MediaType } from '@/modules/media/enums'
import { RequirePermissions, UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'
import { CursorPaginationDto, FindOneParams } from '@/modules/shared/dtos'

@Controller('backstage/artists')
@ApiTags('Backstage')
@ApiBearerAuth()
@RequirePermissions(Permissions.Artist.Write)
export class ArtistController {
  constructor(
    private readonly createBackstageArtistUseCase: CreateBackstageArtistUseCase,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
    private readonly getArtistStatisticsUseCase: GetArtistStatisticsUseCase,
    private readonly getBackstageArtistUseCase: GetBackstageArtistUseCase,
    private readonly getBackstageArtistsUseCase: GetBackstageArtistsUseCase,
    private readonly updateBackstageArtistUseCase: UpdateBackstageArtistUseCase,
  ) {}

  @Post('')
  @ApiOperation({
    summary: 'Create an artist',
  })
  @ApiResponse({
    status: 201,
    description: 'The artist has been successfully created',
    type: ArtistCreationResponse,
  })
  async createArtist(@Body() body: ArtistCreationRequest, @UserSession() user: User): Promise<ArtistCreationResponse> {
    const artist = await this.createBackstageArtistUseCase.invoke({
      name: body.name,
      genres: body.genres,
      verified: body.verified,
    })

    const { uploadToken } = await this.generateUploadTokenUseCase.invoke({
      userId: user.id,
      mediaType: MediaType.Image,
      entityType: EntityType.Artist,
      entityId: artist.id,
    })

    return {
      artistId: artist.id,
      uploadToken,
    }
  }

  @Get('')
  @ApiOperation({
    summary: 'Get all artists',
  })
  @ApiResponse({
    status: 200,
    description: 'The artists have been successfully retrieved',
  })
  getArtists(@Query() query: CursorPaginationDto): Promise<any> {
    return this.getBackstageArtistsUseCase.invoke(query)
  }

  @Get('/statistics')
  @ApiOperation({
    summary: 'Get artist statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'The artist statistics have been successfully retrieved.',
    type: ArtistStatisticsResponse,
  })
  getArtistStatistics(): Promise<ArtistStatisticsResponse> {
    return this.getArtistStatisticsUseCase.invoke().then((result) => ({ data: result }))
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a backstage artist with artwork',
  })
  @ApiResponse({
    status: 200,
    description: 'The artist has been successfully retrieved',
    type: ArtistDto,
  })
  getArtist(@Param() params: FindOneParams): Promise<ArtistDto> {
    return this.getBackstageArtistUseCase.invoke({ id: params.id })
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an artist',
  })
  @ApiResponse({
    status: 200,
    description: 'The artist has been successfully updated',
    type: ArtistUpdateResponse,
  })
  async updateArtist(
    @Param() params: FindOneParams,
    @Body() body: ArtistUpdateRequest,
    @UserSession() user: User,
  ): Promise<ArtistUpdateResponse> {
    await this.updateBackstageArtistUseCase.invoke({
      id: params.id,
      name: body.name,
      genres: body.genres,
      verified: body.verified,
    })

    const uploadToken = await this.generateUploadTokenUseCase.invoke({
      userId: user.id,
      mediaType: MediaType.Image,
      entityType: EntityType.Artist,
      entityId: params.id,
    })

    return { uploadToken: uploadToken.uploadToken }
  }
}
