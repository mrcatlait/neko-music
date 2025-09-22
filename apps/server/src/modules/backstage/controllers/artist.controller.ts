import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiOkResponse } from '@nestjs/swagger'

import {
  AddArtistUseCase,
  GenerateArtistUploadTokenUseCase,
  ListArtistsUseCase,
  RemoveArtistUseCase,
  UpdateArtistUseCase,
} from '../use-cases'
import { Artist, ArtistCreationRequest, ArtistsResponse, ArtistUpdateRequest } from '../dtos'

import { UploadTokenDto } from '@/modules/media/dtos'
import { UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'

@Controller('backstage/artists')
@ApiTags('Backstage Artists')
@ApiBearerAuth()
export class ArtistController {
  constructor(
    private readonly addArtistUseCase: AddArtistUseCase,
    private readonly generateArtistUploadTokenUseCase: GenerateArtistUploadTokenUseCase,
    private readonly listArtistsUseCase: ListArtistsUseCase,
    private readonly removeArtistUseCase: RemoveArtistUseCase,
    private readonly updateArtistUseCase: UpdateArtistUseCase,
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get all artists',
  })
  @ApiResponse({
    status: 200,
    description: 'The artists have been successfully retrieved',
    type: ArtistsResponse,
  })
  getArtists(): Promise<ArtistsResponse> {
    return this.listArtistsUseCase.invoke()
  }

  @Post('')
  @ApiOperation({
    summary: 'Create an artist',
  })
  @ApiResponse({
    status: 201,
    description: 'The artist has been successfully created',
    type: Artist,
  })
  createArtist(@Body() body: ArtistCreationRequest): Promise<Artist> {
    return this.addArtistUseCase.invoke({ name: body.name, genres: body.genres })
  }

  @Put(':artistId')
  @ApiOperation({
    summary: 'Update an artist',
  })
  @ApiResponse({
    status: 200,
    description: 'The artist has been successfully updated',
    type: Artist,
  })
  updateArtist(@Param('artistId') artistId: string, @Body() body: ArtistUpdateRequest): Promise<Artist> {
    return this.updateArtistUseCase.invoke({ id: artistId, name: body.name, genres: body.genres })
  }

  @Delete(':artistId')
  @ApiOperation({
    summary: 'Delete an artist',
  })
  @ApiResponse({
    status: 200,
    description: 'The artist has been successfully deleted',
  })
  deleteArtist(@Param('artistId') artistId: string): Promise<void> {
    return this.removeArtistUseCase.invoke({ id: artistId })
  }

  @Get(':artistId/upload-token')
  @ApiOperation({
    summary: 'Get an upload token for the artist artwork',
  })
  @ApiOkResponse({
    type: UploadTokenDto,
  })
  getUploadToken(@Param('artistId') artistId: string, @UserSession() user: User): Promise<UploadTokenDto> {
    return this.generateArtistUploadTokenUseCase.invoke({ artistId, userId: user.id })
  }
}
