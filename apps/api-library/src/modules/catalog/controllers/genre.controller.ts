import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth, ApiResponse } from '@nestjs/swagger'

import { CreateGenreDto, GenreDto } from '../dtos'
import { CreateGenreUseCase } from '../use-cases'

import { AuthGuard } from '@modules/auth/guards'

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
    type: GenreDto,
  })
  createGenre(@Body() createGenreDto: CreateGenreDto): Promise<GenreDto> {
    return this.createGenreUseCase.invoke({ name: createGenreDto.name })
  }
}
