import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger'

import { ArtistResponse } from '../dtos'
import { GetArtistUseCase } from '../use-cases'

@Controller('catalog/artists')
@ApiTags('Artists')
@ApiBearerAuth()
export class ArtistController {
  constructor(private readonly getArtistUseCase: GetArtistUseCase) {}

  @Get(':artistId')
  @ApiOperation({
    summary: 'Get an artist',
  })
  @ApiOkResponse({
    type: ArtistResponse,
  })
  getArtist(@Param('artistId') artistId: string): Promise<ArtistResponse> {
    return this.getArtistUseCase.invoke({ id: artistId }) as any
  }
}
