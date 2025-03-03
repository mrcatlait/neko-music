import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger'
import { CommandBus } from '@nestjs/cqrs'

import { CreateArtistDto } from '../dtos'
import { CreateArtistCommand } from '../commands'

import { AuthGuard } from '@modules/authentication/guards'
import { Session } from '@modules/authentication/decorators'
import { UserSession } from '@modules/authentication/interfaces'
import { GenerateUploadTokenCommand } from '@modules/media/commands'
import { EntityType, MediaType } from '@modules/media/enums'
import { UploadTokenDto } from '@modules/media/dtos'

@Controller('artists')
@ApiTags('Artists')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class ArtistController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  @ApiOperation({
    summary: 'Create an artist',
  })
  createArtist(@Body() body: CreateArtistDto): Promise<void> {
    return this.commandBus.execute(
      new CreateArtistCommand(body.name, body.verified, body.genres, body.shortText, body.standardText),
    )
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
      new GenerateUploadTokenCommand(session.userId, artistId, EntityType.ARTIST, MediaType.IMAGE),
    )
  }
}
