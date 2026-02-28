import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

import { GenreCreationRequest, GenreCreationResponse } from '../dtos'
import { AddGenreUseCase } from '../use-cases'

import { AuthGuard } from '@/modules/auth/guards'

@Controller('backstage/genres')
@ApiTags('Backstage')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class GenreController {
  constructor(private readonly addGenreUseCase: AddGenreUseCase) {}

  @Post('')
  @ApiOperation({
    summary: 'Create a genre',
  })
  @ApiResponse({
    status: 201,
    description: 'The genre has been successfully created.',
    type: GenreCreationResponse,
  })
  createGenre(@Body() body: GenreCreationRequest): Promise<GenreCreationResponse> {
    return this.addGenreUseCase.invoke({ name: body.name })
  }
}
