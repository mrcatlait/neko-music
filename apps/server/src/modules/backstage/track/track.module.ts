import { Module } from '@nestjs/common'

import { TrackListener } from './listeners'
import { TrackMutation } from './mutations'
import { TrackRepository } from './repositories'
import {
  CreateBackstageTrackUseCase,
  CreateBackstageTrackValidator,
  GenerateTrackAudioUploadTokenUseCase,
  GenerateTrackAudioUploadTokenValidator,
  GetBackstageTrackUseCase,
  ProcessBackstageTrackLifecycleUseCase,
  SyncPublishedTrackUseCase,
  SyncPublishedTrackValidator,
  UpdateBackstageTrackArtworkUseCase,
  UpdateBackstageTrackArtworkValidator,
  UpdateBackstageTrackPlaybackUseCase,
  UpdateBackstageTrackPlaybackValidator,
} from './use-cases'

@Module({
  imports: [],
  providers: [
    // Listeners
    TrackListener,
    // Mutations
    TrackMutation,
    // Queries
    // TrackQuery,
    // Repositories
    TrackRepository,
    // Use cases
    CreateBackstageTrackUseCase,
    CreateBackstageTrackValidator,
    GenerateTrackAudioUploadTokenUseCase,
    GenerateTrackAudioUploadTokenValidator,
    GetBackstageTrackUseCase,
    ProcessBackstageTrackLifecycleUseCase,
    SyncPublishedTrackUseCase,
    SyncPublishedTrackValidator,
    UpdateBackstageTrackArtworkUseCase,
    UpdateBackstageTrackArtworkValidator,
    UpdateBackstageTrackPlaybackUseCase,
    UpdateBackstageTrackPlaybackValidator,
  ],
  exports: [TrackRepository, ProcessBackstageTrackLifecycleUseCase],
})
export class BackstageTrackModule {}
