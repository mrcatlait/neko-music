import { Injectable } from '@nestjs/common'
import { Args, Query } from '@nestjs/graphql'
import { Permissions } from '@neko/permissions'

import { BackstageArtist } from '../models'
import { GetBackstageArtistsUseCase, GetBackstageArtistUseCase } from '../use-cases'
import { PagePaginationArgs } from '../../shared/models'

import { RequirePermissions } from '@/modules/auth/decorators'

@Injectable()
export class ArtistQuery {
  constructor(
    private readonly getBackstageArtistUseCase: GetBackstageArtistUseCase,
    private readonly getBackstageArtistsUseCase: GetBackstageArtistsUseCase,
  ) {}

  @Query(() => BackstageArtist)
  @RequirePermissions(Permissions.Artist.Read)
  backstageArtist(@Args('id') id: string): Promise<BackstageArtist> {
    return this.getBackstageArtistUseCase.invoke({ id })
  }

  @Query(() => [BackstageArtist])
  @RequirePermissions(Permissions.Artist.Read)
  backstageArtists(@Args({ nullable: true }) args: PagePaginationArgs): Promise<BackstageArtist[]> {
    return this.getBackstageArtistsUseCase
      .invoke({ limit: args.limit, offset: args.offset })
      .then((result) => result.data)
  }
}
