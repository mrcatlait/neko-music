import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
import { gql } from '@urql/core'

import { GenreForm } from '../../components'

import { IconButton } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'
import { Graphql } from '@/core/services/graphql'

interface GetGenreQuery {
  backstageGenre: {
    id: string
    name: string
    slug: string
  }
}

@Component({
  selector: 'n-genre-edit-page',
  templateUrl: './genre-edit-page.html',
  styleUrl: './genre-edit-page.scss',
  imports: [GenreForm, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreEditPage implements OnInit {
  private readonly router = inject(Router)
  private readonly graphql = inject(Graphql)
  private readonly snackbar = inject(Snackbar)

  protected readonly genre = signal<GetGenreQuery['backstageGenre'] | null>(null)

  readonly genreId = input.required<string>()

  protected readonly saving = signal(false)

  ngOnInit(): void {
    this.graphql
      .query(
        gql`
          query GetGenre($id: String!) {
            backstageGenre(id: $id) {
              id
              name
              slug
            }
          }
        `,
        { id: this.genreId() },
      )
      .then((result) => {
        if (result.error) {
          this.snackbar.info(result.error.message)
        }

        if (result.data) {
          this.genre.set(result.data.backstageGenre)
        }
      })
  }

  protected editGenre(data: { name: string; slug: string }): void {
    this.saving.set(true)

    this.graphql
      .mutation(
        gql`
          mutation UpdateGenre($id: String!, $genre: UpdateGenreInput!) {
            updateGenre(id: $id, genre: $genre) {
              id
              name
              slug
            }
          }
        `,
        { id: this.genreId(), genre: { name: data.name, slug: data.slug } },
      )
      .then((result) => {
        if (result.error) {
          this.saving.set(false)

          this.snackbar.info('Failed to update genre')
        }

        if (result.data) {
          this.saving.set(false)
          this.snackbar.info('Genre updated successfully')
          this.router.navigate(['/backstage/genres'])
        }
      })
  }

  protected navigateToGenreList(): void {
    this.router.navigate(['/backstage/genres'])
  }
}
