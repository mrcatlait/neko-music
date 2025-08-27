import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Permissions } from '@neko/permissions'

import {
  ArtistCreationRequest,
  ArtistResponse,
  ArtistReviewRequest,
  ArtistUpdateRequest,
  ArtistVerifyRequest,
} from '../dtos'
import {
  CreateArtistUseCase,
  GetArtistArtworkUploadTokenUseCase,
  GetArtistUseCase,
  UpdateArtistStatusUseCase,
  UpdateArtistUseCase,
  UpdateVerifiedStatusUseCase,
} from '../use-cases'

import { UploadTokenDto } from '@/modules/media/dtos'
import { RequirePermissions, Session } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'

@Controller('artists')
@ApiTags('Artists')
@ApiBearerAuth()
export class ArtistController {
  constructor(
    private readonly createArtistUseCase: CreateArtistUseCase,
    private readonly getArtistUseCase: GetArtistUseCase,
    private readonly updateArtistUseCase: UpdateArtistUseCase,
    private readonly updateArtistStatusUseCase: UpdateArtistStatusUseCase,
    private readonly updateVerifiedStatusUseCase: UpdateVerifiedStatusUseCase,
    private readonly getArtistArtworkUploadTokenUseCase: GetArtistArtworkUploadTokenUseCase,
  ) {}

  @Get(':artistId')
  @ApiOperation({
    summary: 'Get an artist',
  })
  @ApiOkResponse({
    type: ArtistResponse,
  })
  getArtist(@Param('artistId') artistId: string): Promise<ArtistResponse> {
    return this.getArtistUseCase.invoke({ id: artistId })
  }

  @Post('')
  @RequirePermissions(Permissions.Artist.Write)
  @ApiOperation({
    summary: 'Create an artist',
  })
  @ApiOkResponse({
    type: ArtistResponse,
  })
  createArtist(@Body() body: ArtistCreationRequest): Promise<ArtistResponse> {
    return this.createArtistUseCase.invoke({
      name: body.name,
      genres: body.genres,
    })
  }

  @Put(':artistId')
  @RequirePermissions(Permissions.Artist.Write)
  @ApiOperation({
    summary: 'Update an artist',
  })
  @ApiOkResponse({
    type: ArtistResponse,
  })
  updateArtist(@Param('artistId') artistId: string, @Body() body: ArtistUpdateRequest): Promise<ArtistResponse> {
    return this.updateArtistUseCase.invoke({
      id: artistId,
      name: body.name,
      genres: body.genres,
    })
  }

  @Put(':artistId/verify')
  @RequirePermissions(Permissions.Artist.Write)
  @ApiOperation({
    summary: 'Verify an artist',
  })
  @ApiOkResponse({
    type: ArtistResponse,
  })
  updateVerifiedStatus(
    @Param('artistId') artistId: string,
    @Body() body: ArtistVerifyRequest,
  ): Promise<ArtistResponse> {
    return this.updateVerifiedStatusUseCase.invoke({ id: artistId, verified: body.verified })
  }

  @Put(':artistId/status')
  @RequirePermissions(Permissions.Artist.Write)
  @ApiOperation({
    summary: 'Update publishing status of an artist',
  })
  @ApiOkResponse({
    type: ArtistResponse,
  })
  reviewArtist(@Param('artistId') artistId: string, @Body() body: ArtistReviewRequest): Promise<ArtistResponse> {
    return this.updateArtistStatusUseCase.invoke({ id: artistId, status: body.status })
  }

  @Get(':artistId/upload-token')
  @RequirePermissions(Permissions.Artist.Write)
  @ApiOperation({
    summary: 'Get an upload token for an artist',
  })
  @ApiOkResponse({
    type: UploadTokenDto,
  })
  getUploadToken(@Param('artistId') artistId: string, @Session() user: User): Promise<UploadTokenDto> {
    return this.getArtistArtworkUploadTokenUseCase.invoke({ artistId, userId: user.id })
  }
}
