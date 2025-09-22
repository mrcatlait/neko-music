import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { GenreCreationRequest, GenreUpdateRequest, Genre, GenresResponse } from '../dtos'
import { AddGenreUseCase, ListGenresUseCase, RemoveGenreUseCase, UpdateGenreUseCase } from '../use-cases'

@Controller('backstage/genres')
@ApiTags('Backstage Genres')
@ApiBearerAuth()
export class GenreController {
  constructor(
    private readonly addGenreUseCase: AddGenreUseCase,
    private readonly listGenresUseCase: ListGenresUseCase,
    private readonly removeGenreUseCase: RemoveGenreUseCase,
    private readonly updateGenreUseCase: UpdateGenreUseCase,
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get all genres',
  })
  @ApiResponse({
    status: 200,
    description: 'The genres have been successfully retrieved',
    type: GenresResponse,
  })
  getGenres(): Promise<GenresResponse> {
    return this.listGenresUseCase.invoke()
  }

  @Post('')
  @ApiOperation({
    summary: 'Create a new genre',
  })
  @ApiResponse({
    status: 201,
    description: 'The genre has been successfully created',
    type: Genre,
  })
  createGenre(@Body() body: GenreCreationRequest): Promise<Genre> {
    return this.addGenreUseCase.invoke({ name: body.name })
  }

  @Put(':genreId')
  @ApiOperation({
    summary: 'Update a genre',
  })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully updated',
    type: Genre,
  })
  updateGenre(@Param('genreId') genreId: string, @Body() body: GenreUpdateRequest): Promise<Genre> {
    return this.updateGenreUseCase.invoke({ id: genreId, name: body.name })
  }

  @Delete(':genreId')
  @ApiOperation({
    summary: 'Delete a genre',
  })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully deleted',
  })
  deleteGenre(@Param('genreId') genreId: string): Promise<void> {
    return this.removeGenreUseCase.invoke({ id: genreId })
  }
}
