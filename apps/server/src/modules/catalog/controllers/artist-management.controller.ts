import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

import { ArtistResponse, GenreResponse } from '../dtos'
import { ListAllArtistsUseCase } from '../use-cases'

@Controller('catalog-management/artists')
@ApiTags('Artists')
@ApiBearerAuth()
export class ArtistManagementController {
  constructor(private readonly listAllArtistsUseCase: ListAllArtistsUseCase) {}

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
}
