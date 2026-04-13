import { Injectable } from '@nestjs/common'
import { Args, Mutation } from '@nestjs/graphql'
import { Permissions } from '@neko/permissions'

import { BackstageTrack, CreateTrackInput } from '../models'
import { CreateBackstageTrackUseCase, GenerateTrackAudioUploadTokenUseCase } from '../use-cases'

import { RequirePermissions, UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'
import { UploadToken } from '@/modules/media/models'

@Injectable()
export class TrackMutation {
  constructor(
    private readonly createBackstageTrackUseCase: CreateBackstageTrackUseCase,
    private readonly generateTrackAudioUploadTokenUseCase: GenerateTrackAudioUploadTokenUseCase,
  ) {}

  @Mutation(() => BackstageTrack)
  @RequirePermissions(Permissions.Track.Write)
  createTrack(@Args('track') track: CreateTrackInput, @UserSession() user: User): Promise<BackstageTrack> {
    return this.createBackstageTrackUseCase.invoke({
      name: track.name,
      albumId: track.albumId,
      trackNumber: track.trackNumber,
      diskNumber: track.diskNumber,
      releaseDate: track.releaseDate,
      type: track.type,
      explicit: track.explicit,
      genres: track.genres,
      userId: user.id,
    })
  }

  @Mutation(() => UploadToken)
  @RequirePermissions(Permissions.Track.Write)
  generateTrackArtworkUploadToken(@Args('id') id: string, @UserSession() user: User): Promise<UploadToken> {
    return this.generateTrackAudioUploadTokenUseCase.invoke({
      trackId: id,
      userId: user.id,
    })
  }
}
