import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Permissions } from '@neko/permissions'

import { GenreCreationRequest, GenreParams, GenreResponse } from '../dtos'
import { AddGenreUseCase, ListAllGenresUseCase, ListPublishedGenresUseCase, PublishGenreUseCase } from '../use-cases'
import { RecordStatus } from '../enums'

import { RequirePermissions } from '@/modules/auth/decorators'

@Controller('catalog-management/genres')
@RequirePermissions(Permissions.Genre.Write)
@ApiTags('Genres')
@ApiBearerAuth()
export class GenreManagementController {
  constructor(
    private readonly addGenreUseCase: AddGenreUseCase,
    private readonly listAllGenresUseCase: ListAllGenresUseCase,
    private readonly listPublishedGenresUseCase: ListPublishedGenresUseCase,
    private readonly publishGenreUseCase: PublishGenreUseCase,
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get genres',
  })
  @ApiResponse({
    status: 200,
    description: 'The genres have been successfully retrieved.',
    type: [GenreResponse],
  })
  getGenres(@Query() params: GenreParams): Promise<GenreResponse[]> {
    switch (params.status) {
      case RecordStatus.PUBLISHED:
        return this.listPublishedGenresUseCase.invoke()
      default:
        return this.listAllGenresUseCase.invoke()
    }
  }

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
    return this.addGenreUseCase.invoke({ name: body.name })
  }

  @Put(':genreId/publish')
  @ApiOperation({
    summary: 'Publish a genre',
  })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully published.',
  })
  publishGenre(@Param('genreId') genreId: string): Promise<void> {
    return this.publishGenreUseCase.invoke({ id: genreId })
  }
}
