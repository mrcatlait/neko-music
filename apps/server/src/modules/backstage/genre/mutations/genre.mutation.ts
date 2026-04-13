import { Args, Mutation } from '@nestjs/graphql'
import { Injectable } from '@nestjs/common'
import { Permissions } from '@neko/permissions'

import { CreateBackstageGenreUseCase, UpdateBackstageGenreUseCase } from '../use-cases'
import { BackstageGenre, CreateGenreInput, UpdateGenreInput } from '../models'

import { RequirePermissions, UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'

@Injectable()
export class GenreMutation {
  constructor(
    private readonly createBackstageGenreUseCase: CreateBackstageGenreUseCase,
    private readonly updateBackstageGenreUseCase: UpdateBackstageGenreUseCase,
  ) {}

  @Mutation(() => BackstageGenre)
  @RequirePermissions(Permissions.Genre.Write)
  createGenre(@Args('genre') genre: CreateGenreInput, @UserSession() user: User): Promise<BackstageGenre> {
    return this.createBackstageGenreUseCase.invoke({ name: genre.name, slug: genre.slug, userId: user.id })
  }

  @Mutation(() => BackstageGenre)
  @RequirePermissions(Permissions.Genre.Write)
  updateGenre(
    @Args('id') id: string,
    @Args('genre') genre: UpdateGenreInput,
    @UserSession() user: User,
  ): Promise<BackstageGenre> {
    return this.updateBackstageGenreUseCase.invoke({ id, name: genre.name, slug: genre.slug, userId: user.id })
  }
}
