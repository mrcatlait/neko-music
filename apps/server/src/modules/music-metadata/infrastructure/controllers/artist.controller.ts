import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth } from '@nestjs/swagger'

import { CreateArtistHandler } from '@modules/music-metadata/artist/commands'
import { GetArtistHandler } from '@modules/music-metadata/artist/queries'
import { AuthGuard } from '@modules/authentication/infrastructure/guards'
import { CreateArtistDto } from '@modules/music-metadata/shared/dtos'

@Controller('artist')
@ApiTags('Artists')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class ArtistController {
  constructor(
    private readonly getArtistHandler: GetArtistHandler,
    private readonly createArtistHandler: CreateArtistHandler,
  ) {}

  @Post('')
  @ApiOperation({
    summary: 'Create an artist',
  })
  createArtist(@Body() body: CreateArtistDto): Promise<void> {
    return this.createArtistHandler.handle(body)
  }
}
