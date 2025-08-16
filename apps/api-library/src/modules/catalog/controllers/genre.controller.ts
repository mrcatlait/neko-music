import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth, ApiResponse } from '@nestjs/swagger'

import { GenreCreationRequest, GenreResponse } from '../dtos'
import { CreateGenreUseCase } from '../use-cases'

import { AuthGuard } from '@/modules/auth/guards'

@Controller('genres')
@ApiTags('Genres')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class GenreController {
  constructor(private readonly createGenreUseCase: CreateGenreUseCase) {}

  @Post('')
  @ApiOperation({
    summary: 'Create a new genre',
  })
  @ApiResponse({
    status: 201,
    description: 'The genre has been successfully created.',
    type: GenreResponse,
  })
  createGenre(@Body() body: GenreCreationRequest): Promise<GenreResponse> {
    return this.createGenreUseCase.invoke({ name: body.name })
  }
}
