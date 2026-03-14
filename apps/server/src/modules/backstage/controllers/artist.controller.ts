import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger'
import { Permissions } from '@neko/permissions'

import {
  CreateBackstageArtistUseCase,
  GetArtistStatisticsUseCase,
  GetBackstageArtistUseCase,
  PublishArtistUseCase,
  UpdateBackstageArtistUseCase,
} from '../use-cases'
import {
  ArtistCreationRequest,
  ArtistCreationResponse,
  ArtistStatisticsResponse,
  ArtistUpdateRequest,
  ArtistUpdateResponse,
  BackstageArtist,
} from '../dtos'

import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'
import { EntityType, MediaType } from '@/modules/media/enums'
import { RequirePermissions, UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'

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
    private readonly publishArtistUseCase: PublishArtistUseCase,
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

    const uploadToken = await this.generateUploadTokenUseCase.invoke({
      userId: user.id,
      mediaType: MediaType.Image,
      entityType: EntityType.Artist,
      entityId: artist.id,
    })

    return {
      artistId: artist.id,
      uploadToken: uploadToken.uploadToken,
    }
  }

  @Get(':artistId')
  @ApiOperation({
    summary: 'Get a backstage artist with artwork',
  })
  @ApiResponse({
    status: 200,
    description: 'The artist has been successfully retrieved',
    type: BackstageArtist,
  })
  getArtist(@Param('artistId') artistId: string): Promise<BackstageArtist> {
    return this.getBackstageArtistUseCase.invoke({ artistId })
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

  @Put(':artistId')
  @ApiOperation({
    summary: 'Update an artist',
  })
  @ApiResponse({
    status: 200,
    description: 'The artist has been successfully updated',
    type: ArtistUpdateResponse,
  })
  async updateArtist(
    @Param('artistId') artistId: string,
    @Body() body: ArtistUpdateRequest,
    @UserSession() user: User,
  ): Promise<ArtistUpdateResponse> {
    await this.updateBackstageArtistUseCase.invoke({
      artistId,
      name: body.name,
      genres: body.genres,
      verified: body.verified,
    })

    const uploadToken = await this.generateUploadTokenUseCase.invoke({
      userId: user.id,
      mediaType: MediaType.Image,
      entityType: EntityType.Artist,
      entityId: artistId,
    })

    return { uploadToken: uploadToken.uploadToken }
  }

  @Put(':artistId/publish')
  @ApiOperation({
    summary: 'Publish an artist',
  })
  @ApiResponse({
    status: 200,
    description: 'The artist has been successfully published',
  })
  publishArtist(@Param('artistId') artistId: string): Promise<void> {
    return this.publishArtistUseCase.invoke({ artistId })
  }
}
