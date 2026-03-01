import { Controller, Param, Put } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger'

import { PublishAlbumUseCase } from '../use-cases'

import { UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'

@Controller('backstage/albums')
@ApiTags('Backstage')
@ApiBearerAuth()
export class AlbumController {
  constructor(private readonly publishAlbumUseCase: PublishAlbumUseCase) {}

  @Put(':albumId/publish')
  @ApiOperation({
    summary: 'Publish an album',
  })
  @ApiResponse({
    status: 200,
    description: 'The album has been successfully published',
  })
  publishAlbum(@Param('albumId') albumId: string, @UserSession() user: User): Promise<void> {
    return this.publishAlbumUseCase.invoke({ userId: user.id, albumId })
  }
}
