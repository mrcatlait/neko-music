import { Body, Controller, Param, Post, Put } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger'

import { CreateBackstageArtistUseCase, PublishArtistUseCase } from '../use-cases'
import { ArtistCreationRequest, ArtistCreationResponse } from '../dtos'

import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'
import { EntityType, MediaType } from '@/modules/media/enums'
import { UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'

@Controller('backstage/artists')
@ApiTags('Backstage')
@ApiBearerAuth()
export class ArtistController {
  constructor(
    private readonly createBackstageArtistUseCase: CreateBackstageArtistUseCase,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
    private readonly publishArtistUseCase: PublishArtistUseCase,
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
      userId: user.id,
      name: body.name,
      genres: body.genres,
      verified: body.verified,
    })

    const uploadToken = await this.generateUploadTokenUseCase.invoke({
      userId: user.id,
      mediaType: MediaType.IMAGE,
      entityType: EntityType.ARTIST,
      entityId: artist.id,
    })

    return {
      artistId: artist.id,
      uploadToken: uploadToken.uploadToken,
    }
  }

  @Put(':artistId/publish')
  @ApiOperation({
    summary: 'Publish an artist',
  })
  @ApiResponse({
    status: 200,
    description: 'The artist has been successfully published',
  })
  publishArtist(@Param('artistId') artistId: string, @UserSession() user: User): Promise<void> {
    return this.publishArtistUseCase.invoke({ userId: user.id, artistId })
  }
}
