import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth, ApiResponse } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

import { GenreEntity } from '../entities'
import { GetGenresQuery } from '../queries'
import { CreateGenreCommand } from '../commands'
import { CreateGenreDto, GenreDto } from '../dtos'

import { AuthGuard } from '@modules/authentication/guards'

@Controller('genres')
@ApiTags('Genres')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class GenreController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get all genres',
  })
  getGenres(): Promise<GenreEntity[]> {
    return this.queryBus.execute(new GetGenresQuery())
  }

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
    return this.commandBus.execute(new CreateGenreCommand(createGenreDto.name))
  }
}
