import { Controller, Get, Param, Session } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'

import { ArtistResponse, GenreResponse } from '../dtos'
import { GenerateArtistUploadTokenUseCase, ListAllArtistsUseCase } from '../use-cases'

import { User } from '@/modules/auth/interfaces'
import { UploadTokenDto } from '@/modules/media/dtos'

@Controller('catalog-management/artists')
// @RequirePermissions(Permissions.Artist.Write)
@ApiTags('Artists')
@ApiBearerAuth()
export class ArtistManagementController {
  constructor(
    private readonly listAllArtistsUseCase: ListAllArtistsUseCase,
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

  @Get(':artistId/upload-token')
  @ApiOperation({
    summary: 'Get an upload token for an artist',
  })
  @ApiOkResponse({
    type: UploadTokenDto,
  })
  getUploadToken(@Param('artistId') artistId: string, @Session() user: User): Promise<UploadTokenDto> {
    return this.generateArtistUploadTokenUseCase.invoke({ artistId, userId: user.id })
  }
}
