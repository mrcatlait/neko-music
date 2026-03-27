import { Injectable } from '@nestjs/common'
import { Args, Mutation } from '@nestjs/graphql'
import { Permissions } from '@neko/permissions'

import { BackstageArtist, CreateArtistInput, UpdateArtistInput } from '../models'
import {
  CreateBackstageArtistUseCase,
  GenerateArtistArtworkUploadTokenUseCase,
  UpdateBackstageArtistUseCase,
} from '../use-cases'

import { RequirePermissions, UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'
import { UploadToken } from '@/modules/media/models'

@Injectable()
export class ArtistMutation {
  constructor(
    private readonly createBackstageArtistUseCase: CreateBackstageArtistUseCase,
    private readonly updateBackstageArtistUseCase: UpdateBackstageArtistUseCase,
    private readonly generateArtistArtworkUploadTokenUseCase: GenerateArtistArtworkUploadTokenUseCase,
  ) {}

  @Mutation(() => BackstageArtist)
  @RequirePermissions(Permissions.Artist.Write)
  createArtist(@Args('artist') artist: CreateArtistInput, @UserSession() user: User): Promise<BackstageArtist> {
    return this.createBackstageArtistUseCase.invoke({
      name: artist.name,
      genres: artist.genres,
      verified: artist.verified,
      userId: user.id,
    })
  }

  @Mutation(() => BackstageArtist)
  @RequirePermissions(Permissions.Artist.Write)
  updateArtist(
    @Args('id') id: string,
    @Args('artist') artist: UpdateArtistInput,
    @UserSession() user: User,
  ): Promise<BackstageArtist> {
    return this.updateBackstageArtistUseCase.invoke({
      id,
      name: artist.name,
      genres: artist.genres,
      verified: artist.verified,
      userId: user.id,
    })
  }

  @Mutation(() => UploadToken)
  @RequirePermissions(Permissions.Artist.Write)
  generateArtistArtworkUploadToken(@Args('id') id: string, @UserSession() user: User): Promise<UploadToken> {
    return this.generateArtistArtworkUploadTokenUseCase.invoke({
      artistId: id,
      userId: user.id,
    })
  }
}
