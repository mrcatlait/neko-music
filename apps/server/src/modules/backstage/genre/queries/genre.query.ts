import { Args, Query } from '@nestjs/graphql'
import { Injectable } from '@nestjs/common'
import { Permissions } from '@neko/permissions'

import { BackstageGenre, GenresInput } from '../models'
import { GetBackstageGenresUseCase, GetBackstageGenreUseCase } from '../use-cases'

import { RequirePermissions } from '@/modules/auth/decorators'

@Injectable()
export class GenreQuery {
  constructor(
    private readonly getBackstageGenreUseCase: GetBackstageGenreUseCase,
    private readonly getBackstageGenresUseCase: GetBackstageGenresUseCase,
  ) {}

  @Query(() => BackstageGenre)
  @RequirePermissions(Permissions.Genre.Write)
  backstageGenre(@Args('id') id: string): Promise<BackstageGenre> {
    return this.getBackstageGenreUseCase.invoke({ id })
  }

  @Query(() => [BackstageGenre])
  @RequirePermissions(Permissions.Genre.Write)
  backstageGenres(@Args('input', { nullable: true }) input?: GenresInput): Promise<BackstageGenre[]> {
    return this.getBackstageGenresUseCase
      .invoke({
        limit: input?.pagination?.limit,
        offset: input?.pagination?.offset,
        search: input?.filters?.search,
        ids: input?.filters?.ids,
      })
      .then((result) => result.data)
  }
}
