import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger'

import { ArtistDto, CreateArtistDto } from '../dtos'
import { CreateArtistUseCase, GetArtistUseCase } from '../use-cases'

import { UploadTokenDto } from '@/modules/media/dtos'
import { EntityType, MediaType } from '@/modules/media/enums'
import { UserSession } from '@/modules/auth/interfaces'
import { Session } from '@/modules/auth/decorators'
import { AuthGuard } from '@/modules/auth/guards'
import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'

@Controller('artists')
@ApiTags('Artists')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class ArtistController {
  constructor(
    private readonly createArtistUseCase: CreateArtistUseCase,
    private readonly getArtistUseCase: GetArtistUseCase,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
  ) {}

  @Post('')
  @ApiOperation({
    summary: 'Create an artist',
  })
  @ApiOkResponse({
    type: ArtistDto,
  })
  createArtist(@Body() body: CreateArtistDto): Promise<ArtistDto> {
    return this.createArtistUseCase.invoke({
      name: body.name,
      verified: body.verified,
      genres: body.genres,
    })
  }

  @Get(':artistId')
  @ApiOperation({
    summary: 'Get an artist',
  })
  @ApiOkResponse({
    type: ArtistDto,
  })
  getArtist(@Param('artistId') artistId: string): Promise<ArtistDto> {
    return this.getArtistUseCase.invoke({ id: artistId })
  }

  @Get(':artistId/upload-token')
  @ApiOperation({
    summary: 'Get an upload token for an artist',
  })
  @ApiOkResponse({
    type: UploadTokenDto,
  })
  getUploadToken(@Param('artistId') artistId: string, @Session() session: UserSession): Promise<UploadTokenDto> {
    return this.generateUploadTokenUseCase.invoke({
      userId: session.userId,
      mediaType: MediaType.ARTWORK,
      entityType: EntityType.ARTIST,
      entityId: artistId,
    })
  }
}
