import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Permissions } from '@neko/permissions'

import {
  Genre,
  GenreCreationRequest,
  GenreCreationResponse,
  GenresResponse,
  GenreStatisticsResponse,
  GenreUpdateRequest,
} from '../dtos'
import {
  AddGenreUseCase,
  GetGenreStatisticsUseCase,
  GetGenresUseCase,
  GetGenreUseCase,
  UpdateGenreUseCase,
} from '../use-cases'

import { RequirePermissions } from '@/modules/auth/decorators'

@Controller('backstage/genres')
@ApiTags('Backstage')
@ApiBearerAuth()
@RequirePermissions(Permissions.Genre.Write)
export class GenreController {
  constructor(
    private readonly addGenreUseCase: AddGenreUseCase,
    private readonly getGenreStatisticsUseCase: GetGenreStatisticsUseCase,
    private readonly getGenresUseCase: GetGenresUseCase,
    private readonly getGenreUseCase: GetGenreUseCase,
    private readonly updateGenreUseCase: UpdateGenreUseCase,
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get all genres',
  })
  @ApiResponse({
    status: 200,
    description: 'The genres have been successfully retrieved.',
    type: GenresResponse,
  })
  getGenres(): Promise<GenresResponse> {
    return this.getGenresUseCase.invoke().then((result) => ({ data: result }))
  }

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

  @Get(':genreId')
  @ApiOperation({
    summary: 'Get a genre',
  })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully retrieved.',
    type: Genre,
  })
  getGenre(@Param('genreId') genreId: string): Promise<Genre> {
    return this.getGenreUseCase.invoke(genreId)
  }

  @Put(':genreId')
  @ApiOperation({
    summary: 'Update a genre',
  })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully updated.',
    type: Genre,
  })
  updateGenre(@Param('genreId') genreId: string, @Body() body: GenreUpdateRequest): Promise<Genre> {
    return this.updateGenreUseCase.invoke({ id: genreId, name: body.name })
  }

  @Get('/statistics')
  @ApiOperation({
    summary: 'Get genre statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'The genre statistics have been successfully retrieved.',
    type: GenreStatisticsResponse,
  })
  getGenreStatistics(): Promise<GenreStatisticsResponse> {
    return this.getGenreStatisticsUseCase.invoke().then((result) => ({ data: result }))
  }
}
