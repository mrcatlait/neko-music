import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
import { of, switchMap } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'

import { ArtistForm } from '../../components'

import { IconButton, LoadingIndicator } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'
import { MediaApi } from '@/modules/backstage/shared/services'
import {
  GetBackstageArtistGql,
  GetBackstageArtistQuery,
  UpdateArtistGql,
  UpdateArtistInput,
} from '@/shared/generated-types'

@Component({
  selector: 'n-artist-detail-page',
  imports: [ArtistForm, IconButton, LoadingIndicator],
  templateUrl: './artist-detail-page.html',
  styleUrl: './artist-detail-page.scss',
  providers: [MediaApi, GetBackstageArtistGql, UpdateArtistGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistDetailPage implements OnInit {
  private readonly router = inject(Router)
  private readonly snackbar = inject(Snackbar)
  private readonly getBackstageArtistGql = inject(GetBackstageArtistGql)
  private readonly updateArtistGql = inject(UpdateArtistGql)
  private readonly mediaApi = inject(MediaApi)

  readonly id = input.required<string>()

  protected readonly artist = signal<GetBackstageArtistQuery['backstageArtist'] | null>(null)
  protected readonly loading = signal(true)
  protected readonly saving = signal(false)

  ngOnInit(): void {
    this.getBackstageArtistGql.fetch({ id: this.id() }).then((result) => {
      if (result.error) {
        this.snackbar.info(result.error.message)
      }

      if (result.data) {
        this.artist.set(result.data.backstageArtist)
      }

      this.loading.set(false)
    })
  }

  protected updateArtist(data: UpdateArtistInput): void {
    this.saving.set(true)

    this.updateArtistGql
      .mutate({ id: this.id(), artist: { name: data.name, genres: data.genres, verified: data.verified } })
      .then((result) => {
        this.saving.set(false)

        if (result.error) {
          this.snackbar.info('Failed to update artist')
        }

        if (result.data) {
          this.snackbar.info('Artist updated successfully')
          this.navigateToArtistList()
        }
      })
  }

  protected navigateToArtistList(): void {
    this.router.navigate(['/backstage/artists'])
  }
}
