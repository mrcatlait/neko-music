import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core'
import { Router } from '@angular/router'
import { of, switchMap } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { Contracts } from '@neko/contracts'

import { ArtistForm } from '../../components'
import { ArtistApi } from '../../artist-api'

import { IconButton, LoadingIndicator } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'
import { MediaApi } from '@/modules/backstage/shared/services'

@Component({
  selector: 'n-artist-detail-page',
  imports: [ArtistForm, IconButton, LoadingIndicator],
  templateUrl: './artist-detail-page.html',
  styleUrl: './artist-detail-page.scss',
  providers: [ArtistApi, MediaApi],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistDetailPage implements OnInit {
  private readonly router = inject(Router)
  private readonly snackbar = inject(Snackbar)
  private readonly artistApi = inject(ArtistApi)
  private readonly mediaApi = inject(MediaApi)

  readonly id = input.required<string>()

  protected readonly artist = signal<Contracts.Backstage.Artists.Artist | undefined>(undefined)
  protected readonly loading = signal(true)
  protected readonly saving = signal(false)

  ngOnInit(): void {
    this.loadArtist()
  }

  private loadArtist(): void {
    this.artistApi.getArtist(this.id()).subscribe({
      next: (artist) => {
        this.artist.set(artist)
        this.loading.set(false)
      },
      error: () => {
        this.snackbar.info('Failed to load artist')
        this.loading.set(false)
      },
    })
  }

  protected updateArtist(data: Contracts.Backstage.Artists.UpdateRequest & { image: File | null }): void {
    this.saving.set(true)

    this.artistApi
      .updateArtist(this.id(), { name: data.name, genres: data.genres, verified: true })
      .pipe(
        switchMap(({ uploadToken }) => {
          if (data.image) {
            return this.mediaApi.upload(data.image, uploadToken)
          }
          return of(null)
        }),
      )
      .subscribe({
        next: () => {
          this.saving.set(false)
          this.snackbar.info('Artist updated successfully')
          this.router.navigate(['/backstage/artists'])
        },
        error: (error) => {
          this.saving.set(false)

          if (error instanceof HttpErrorResponse) {
            this.snackbar.info(error.error.message ?? 'Failed to update artist')
          } else {
            this.snackbar.info('Failed to update artist')
          }
        },
      })
  }

  protected navigateToArtistList(): void {
    this.router.navigate(['/backstage/artists'])
  }
}
