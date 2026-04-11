import { Injectable } from '@nestjs/common'
import { Args, Mutation } from '@nestjs/graphql'
import { Permissions } from '@neko/permissions'

import { BackstageAlbum, CreateAlbumInput, UpdateAlbumInput } from '../models'
import {
  CreateBackstageAlbumUseCase,
  GenerateAlbumArtworkUploadTokenUseCase,
  UpdateBackstageAlbumUseCase,
} from '../use-cases'

import { RequirePermissions, UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'
import { UploadToken } from '@/modules/media/models'

@Injectable()
export class AlbumMutation {
  constructor(
    private readonly createBackstageAlbumUseCase: CreateBackstageAlbumUseCase,
    private readonly updateBackstageAlbumUseCase: UpdateBackstageAlbumUseCase,
    private readonly generateAlbumArtworkUploadTokenUseCase: GenerateAlbumArtworkUploadTokenUseCase,
  ) {}

  @Mutation(() => BackstageAlbum)
  @RequirePermissions(Permissions.Album.Write)
  createAlbum(@Args('album') album: CreateAlbumInput, @UserSession() user: User): Promise<BackstageAlbum> {
    return this.createBackstageAlbumUseCase.invoke({
      name: album.name,
      releaseDate: album.releaseDate,
      explicit: album.explicit,
      type: album.type,
      genres: album.genres,
      userId: user.id,
    })
  }

  @Mutation(() => BackstageAlbum)
  @RequirePermissions(Permissions.Album.Write)
  updateAlbum(
    @Args('id') id: string,
    @Args('album') album: UpdateAlbumInput,
    @UserSession() user: User,
  ): Promise<BackstageAlbum> {
    return this.updateBackstageAlbumUseCase.invoke({
      id,
      name: album.name,
      releaseDate: album.releaseDate,
      explicit: album.explicit,
      type: album.type,
      genres: album.genres,
      userId: user.id,
    })
  }

  @Mutation(() => UploadToken)
  @RequirePermissions(Permissions.Album.Write)
  generateAlbumArtworkUploadToken(@Args('id') id: string, @UserSession() user: User): Promise<UploadToken> {
    return this.generateAlbumArtworkUploadTokenUseCase.invoke({
      albumId: id,
      userId: user.id,
    })
  }
}
