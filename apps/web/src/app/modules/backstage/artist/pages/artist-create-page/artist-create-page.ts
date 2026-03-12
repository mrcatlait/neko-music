import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core'
import { Router } from '@angular/router'
import { switchMap } from 'rxjs'

import { ArtistForm } from '../../components'
import { ArtistApi } from '../../artist-api'

import { IconButton } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'
import { MediaApi } from '@/modules/backstage/shared/services'

@Component({
  selector: 'n-artist-create-page',
  imports: [ArtistForm, IconButton],
  templateUrl: './artist-create-page.html',
  styleUrl: './artist-create-page.scss',
  providers: [ArtistApi, MediaApi],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistCreatePage {
  private readonly router = inject(Router)
  private readonly snackbar = inject(Snackbar)
  private readonly artistApi = inject(ArtistApi)
  private readonly mediaApi = inject(MediaApi)

  protected readonly saving = signal(false)
  protected readonly isDragging = signal(false)
  protected readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput')

  protected createArtist(artist: { name: string; genres: string[]; image: File | null }): void {
    if (!artist.image) return

    this.artistApi
      .create({
        name: artist.name,
        genres: artist.genres,
        verified: true,
      })
      .pipe(
        switchMap(({ uploadToken }) => {
          return this.mediaApi.upload(artist.image!, uploadToken)
        }),
      )
      .subscribe({
        next: () => {
          this.snackbar.info('Artist created successfully')
          this.router.navigate(['/backstage/artists'])
          this.saving.set(false)
        },
        error: () => {
          this.snackbar.info('Failed to create artist')
          this.saving.set(false)
        },
      })
  }

  protected cancel(): void {
    console.log('cancel')
  }

  protected navigateToArtistList(): void {
    this.router.navigate(['/backstage/artists'])
  }
}
