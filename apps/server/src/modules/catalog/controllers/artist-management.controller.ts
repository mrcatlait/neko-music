import { Body, Controller, Get, Param, Post, Session } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'

import { ArtistCreationRequest, ArtistResponse, GenreResponse } from '../dtos'
import { AddArtistUseCase, GenerateArtistUploadTokenUseCase, ListAllArtistsUseCase } from '../use-cases'

import { User } from '@/modules/auth/interfaces'
import { UploadTokenDto } from '@/modules/media/dtos'
import { UserSession } from '@/modules/auth/decorators'

@Controller('catalog-management/artists')
// @RequirePermissions(Permissions.Artist.Write)
@ApiTags('Artists')
@ApiBearerAuth()
export class ArtistManagementController {
  constructor(
    private readonly listAllArtistsUseCase: ListAllArtistsUseCase,
    private readonly addArtistUseCase: AddArtistUseCase,
    private readonly generateArtistUploadTokenUseCase: GenerateArtistUploadTokenUseCase,
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get artists',
  })
  @ApiResponse({
    status: 200,
    description: 'The genres have been successfully retrieved.',
    type: [GenreResponse],
  })
  getArtists(): Promise<ArtistResponse[]> {
    return this.listAllArtistsUseCase.invoke()
  }

  @Post('')
  @ApiOperation({
    summary: 'Create an artist',
  })
  @ApiOkResponse({
    type: ArtistResponse,
  })
  createArtist(@Body() body: ArtistCreationRequest): Promise<ArtistResponse> {
    return this.addArtistUseCase.invoke({
      name: body.name,
      genres: body.genres,
    })
  }

  @Get(':artistId/upload-token')
  @ApiOperation({
    summary: 'Get an upload token for an artist',
  })
  @ApiOkResponse({
    type: UploadTokenDto,
  })
  getUploadToken(@Param('artistId') artistId: string, @UserSession() user: User): Promise<UploadTokenDto> {
    return this.generateArtistUploadTokenUseCase.invoke({ artistId, userId: user.id })
  }
}
