import { Module } from '@nestjs/common'

import { BACKSTAGE_MODULE_OPTIONS } from './tokens'
import {
  AddGenreUseCase,
  AddGenreValidator,
  ListGenresUseCase,
  UpdateGenreUseCase,
  UpdateGenreValidator,
  RemoveGenreValidator,
  RemoveGenreUseCase,
  ListArtistsUseCase,
  AddArtistValidator,
  AddArtistUseCase,
  GetArtistByIdUseCase,
  UpdateArtistUseCase,
  UpdateArtistValidator,
  RemoveArtistUseCase,
  RemoveArtistValidator,
  GenerateArtistUploadTokenUseCase,
  GenerateArtistUploadTokenValidator,
} from './use-cases'
import { ArtistController, GenreController } from './controllers'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class BackstageCoreModule extends CoreModuleWithOptions {
  static module = BackstageCoreModule
  static optionsToken = BACKSTAGE_MODULE_OPTIONS
  static providers = [
    // Use cases
    AddArtistUseCase,
    AddGenreUseCase,
    GenerateArtistUploadTokenUseCase,
    GetArtistByIdUseCase,
    ListArtistsUseCase,
    ListGenresUseCase,
    RemoveArtistUseCase,
    RemoveGenreUseCase,
    UpdateArtistUseCase,
    UpdateGenreUseCase,
    // Use case validators
    AddArtistValidator,
    AddGenreValidator,
    GenerateArtistUploadTokenValidator,
    RemoveArtistValidator,
    RemoveGenreValidator,
    UpdateArtistValidator,
    UpdateGenreValidator,
  ]
  static controllers = [ArtistController, GenreController]
}
