import { Injectable } from '@nestjs/common'
import { Args, Query } from '@nestjs/graphql'
import { Permissions } from '@neko/permissions'

import { AlbumsInput, BackstageAlbum } from '../models'
import { GetBackstageAlbumsUseCase, GetBackstageAlbumUseCase } from '../use-cases'

import { RequirePermissions } from '@/modules/auth/decorators'

@Injectable()
export class AlbumQuery {
  constructor(
    private readonly getBackstageAlbumUseCase: GetBackstageAlbumUseCase,
    private readonly getBackstageAlbumsUseCase: GetBackstageAlbumsUseCase,
  ) {}

  @Query(() => BackstageAlbum)
  @RequirePermissions(Permissions.Album.Read)
  backstageAlbum(@Args('id') id: string): Promise<BackstageAlbum> {
    return this.getBackstageAlbumUseCase.invoke({ id })
  }

  @Query(() => [BackstageAlbum])
  @RequirePermissions(Permissions.Album.Read)
  backstageAlbums(@Args('input', { nullable: true }) input?: AlbumsInput): Promise<BackstageAlbum[]> {
    return this.getBackstageAlbumsUseCase
      .invoke({ limit: input?.pagination?.limit, offset: input?.pagination?.offset })
      .then((result) => result.data)
  }
}
