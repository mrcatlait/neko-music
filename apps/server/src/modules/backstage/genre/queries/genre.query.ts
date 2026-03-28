import { Args, Query } from '@nestjs/graphql'
import { Injectable } from '@nestjs/common'
import { Permissions } from '@neko/permissions'

import { BackstageGenre } from '../models'
import { GetGenresUseCase, GetGenreUseCase } from '../use-cases'
import { FilterArgs } from '../../shared/models'

import { RequirePermissions } from '@/modules/auth/decorators'

@Injectable()
export class GenreQuery {
  constructor(
    private readonly getGenreUseCase: GetGenreUseCase,
    private readonly getGenresUseCase: GetGenresUseCase,
  ) {}

  @Query(() => BackstageGenre)
  @RequirePermissions(Permissions.Genre.Write)
  backstageGenre(@Args('id') id: string): Promise<BackstageGenre> {
    return this.getGenreUseCase.invoke({ id })
  }

  @Query(() => [BackstageGenre])
  @RequirePermissions(Permissions.Genre.Write)
  backstageGenres(@Args({ nullable: true }) args: FilterArgs): Promise<BackstageGenre[]> {
    return this.getGenresUseCase
      .invoke({ limit: args.limit, offset: args.offset, search: args.search })
      .then((result) => result.data)
  }
}
