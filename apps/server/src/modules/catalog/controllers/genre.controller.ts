import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

@Controller('catalog/genres')
@ApiTags('Genres')
@ApiBearerAuth()
export class GenreController {}
