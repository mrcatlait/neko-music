import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiCookieAuth, ApiResponse } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'

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
