import { Module } from '@nestjs/common'

import { ArtistRepository } from './repositories'
import { UpdateCatalogArtistUseCase, UpdateCatalogArtistValidator } from './use-cases'

@Module({
  providers: [ArtistRepository, UpdateCatalogArtistUseCase, UpdateCatalogArtistValidator],
  exports: [UpdateCatalogArtistUseCase],
})
export class CatalogArtistModule {}
