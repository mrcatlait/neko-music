import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

import { CreateArtistCommand } from '../commands'
import { ArtistDto, CreateArtistDto } from '../dtos'
import { GetArtistQuery } from '../queries'

import { UploadTokenDto } from '@modules/media/dtos'
import { EntityType, MediaType } from '@modules/media/enums'
import { GenerateUploadTokenCommand } from '@modules/media/commands'
import { UserSession } from '@modules/authentication/interfaces'
import { Session } from '@modules/authentication/decorators'
import { AuthGuard } from '@modules/authentication/guards'

@Controller('artists')
@ApiTags('Artists')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class ArtistController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('')
  @ApiOperation({
    summary: 'Create an artist',
  })
  @ApiOkResponse({
    type: ArtistDto,
  })
  createArtist(@Body() body: CreateArtistDto): Promise<ArtistDto> {
    return this.commandBus.execute(new CreateArtistCommand(body.name, body.verified, body.genres))
  }

  @Get(':artistId')
  @ApiOperation({
    summary: 'Get an artist',
  })
  @ApiOkResponse({
    type: ArtistDto,
  })
  getArtist(@Param('artistId') artistId: string): Promise<ArtistDto> {
    return this.queryBus.execute(new GetArtistQuery(artistId))
  }

  @Get(':artistId/upload-token')
  @ApiOperation({
    summary: 'Get an upload token for an artist',
  })
  @ApiOkResponse({
    type: UploadTokenDto,
  })
  getUploadToken(@Param('artistId') artistId: string, @Session() session: UserSession): Promise<UploadTokenDto> {
    return this.commandBus.execute(
      new GenerateUploadTokenCommand(session.userId, MediaType.ARTWORK, EntityType.ARTIST, artistId),
    )
  }
}
