import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Permissions } from '@neko/permissions'

import { GenreCreationRequest, GenreListResponse, GenreResponse, GenreUpdateRequest } from '../dtos'
import { AddGenreUseCase, GetGenresUseCase, GetGenreUseCase, UpdateGenreUseCase } from '../use-cases'

import { RequirePermissions, UserSession } from '@/modules/auth/decorators'
import { FindOneParams, PagePaginationMetadata, PagePaginationQuery } from '@/modules/shared/dtos'
import { User } from '@/modules/auth/interfaces'

@Controller('backstage/genres')
@ApiTags('Backstage')
@ApiBearerAuth()
@RequirePermissions(Permissions.Genre.Write)
export class GenreController {
  constructor(
    private readonly addGenreUseCase: AddGenreUseCase,
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
    type: GenreListResponse,
  })
  getGenres(@Query() query: PagePaginationQuery): Promise<GenreListResponse> {
    return this.getGenresUseCase
      .invoke({ limit: query.limit, offset: query.offset })
      .then(
        (result) => new GenreListResponse(result.data, new PagePaginationMetadata({ query, itemCount: result.count })),
      )
  }

  @Post('')
  @ApiOperation({
    summary: 'Create a genre',
  })
  @ApiResponse({
    status: 201,
    description: 'The genre has been successfully created.',
    type: GenreResponse,
  })
  createGenre(@Body() body: GenreCreationRequest, @UserSession() user: User): Promise<GenreResponse> {
    return this.addGenreUseCase
      .invoke({ name: body.name, slug: body.slug, userId: user.id })
      .then((result) => ({ data: result }))
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a genre',
  })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully retrieved.',
    type: GenreResponse,
  })
  getGenre(@Param() params: FindOneParams): Promise<GenreResponse> {
    return this.getGenreUseCase.invoke(params.id).then((result) => ({ data: result }))
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a genre',
  })
  @ApiResponse({
    status: 200,
    description: 'The genre has been successfully updated.',
    type: GenreResponse,
  })
  updateGenre(
    @Param() params: FindOneParams,
    @Body() body: GenreUpdateRequest,
    @UserSession() user: User,
  ): Promise<GenreResponse> {
    return this.updateGenreUseCase
      .invoke({ id: params.id, name: body.name, slug: body.slug, userId: user.id })
      .then((result) => ({ data: result }))
  }
}
