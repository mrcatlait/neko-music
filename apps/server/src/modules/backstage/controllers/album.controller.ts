import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger'

import { AlbumCreationRequest, AlbumCreationResponse } from '../dtos'
import { CreateBackstageAlbumUseCase } from '../use-cases'

import { UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'
import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'
import { EntityType, MediaType } from '@/modules/media/enums'

@Controller('backstage/albums')
@ApiTags('Backstage')
@ApiBearerAuth()
export class AlbumController {
  constructor(
    private readonly createBackstageAlbumUseCase: CreateBackstageAlbumUseCase,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an album' })
  @ApiResponse({
    status: 201,
    description: 'The album has been successfully created',
    type: () => AlbumCreationResponse,
  })
  async createAlbum(@Body() body: AlbumCreationRequest, @UserSession() user: User): Promise<AlbumCreationResponse> {
    const album = await this.createBackstageAlbumUseCase.invoke(body)

    const { uploadToken } = await this.generateUploadTokenUseCase.invoke({
      userId: user.id,
      mediaType: MediaType.Image,
      entityType: EntityType.Album,
      entityId: album.albumId,
    })

    const tracks = await Promise.all(
      album.tracks.map(async (track) => {
        const trackUploadToken = await this.generateUploadTokenUseCase.invoke({
          userId: user.id,
          mediaType: MediaType.Audio,
          entityType: EntityType.Track,
          entityId: track,
        })

        return { id: track, uploadToken: trackUploadToken.uploadToken }
      }),
    )

    return {
      id: album.albumId,
      uploadToken,
      tracks,
    }
  }
}
