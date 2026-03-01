import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Permissions } from '@neko/permissions'

import { GenreCreationRequest, GenreCreationResponse, GenreStatisticsResponse } from '../dtos'
import { AddGenreUseCase, GetGenreStatisticsUseCase } from '../use-cases'

import { RequirePermissions } from '@/modules/auth/decorators'

@Controller('backstage/genres')
@ApiTags('Backstage')
@ApiBearerAuth()
@RequirePermissions(Permissions.Genre.Write)
export class GenreController {
  constructor(
    private readonly addGenreUseCase: AddGenreUseCase,
    private readonly getGenreStatisticsUseCase: GetGenreStatisticsUseCase,
  ) {}

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
