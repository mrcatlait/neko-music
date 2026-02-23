import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger'

import { AddArtistUseCase } from '../use-cases'
import { ArtistCreationRequest, ArtistCreationResponse } from '../dtos'

import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'
import { EntityType, MediaType } from '@/modules/media/enums'
import { UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'

@Controller('backstage/artists')
@ApiTags('Backstage Artists')
@ApiBearerAuth()
export class ArtistController {
  constructor(
    private readonly addArtistUseCase: AddArtistUseCase,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
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
    const artist = await this.addArtistUseCase.invoke({ name: body.name, genres: body.genres, verified: body.verified })

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
}
