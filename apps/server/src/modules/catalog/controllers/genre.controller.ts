import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Permissions } from '@neko/permissions'

import { GenreCreationRequest, GenreResponse } from '../dtos'
import { CreateGenreUseCase } from '../use-cases'

import { RequirePermissions } from '@/modules/auth/decorators'

@Controller('genres')
@ApiTags('Genres')
@ApiBearerAuth()
export class GenreController {
  constructor(private readonly createGenreUseCase: CreateGenreUseCase) {}

  @Post('')
  @RequirePermissions(Permissions.Genre.Write)
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
