import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger'
import { FileInterceptor, File } from '@nest-lab/fastify-multer'

import { AddArtistUseCase } from '../use-cases'
import { Artist, ArtistCreationRequest } from '../dtos'

@Controller('backstage/artists')
@ApiTags('Backstage Artists')
@ApiBearerAuth()
export class ArtistController {
  constructor(private readonly addArtistUseCase: AddArtistUseCase) {}

  @Post('')
  @ApiOperation({
    summary: 'Create an artist',
  })
  @ApiResponse({
    status: 201,
    description: 'The artist has been successfully created',
    type: Artist,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('artwork'))
  createArtist(
    @Body() body: ArtistCreationRequest,
    @UploadedFile()
    artwork: File,
  ): Promise<Artist> {
    return this.addArtistUseCase.invoke({ name: body.name, genres: body.genres, artwork, verified: body.verified })
  }
}
