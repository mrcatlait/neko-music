import { ChangeDetectionStrategy, Component, ElementRef, inject, resource, signal, viewChild } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { switchMap } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { ArtistForm } from '../../components'

import { ENVIRONMENT } from '@/core/providers'
import { Button } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'

@Component({
  selector: 'n-artist-create-page',
  imports: [ArtistForm, Button],
  templateUrl: './artist-create-page.html',
  styleUrl: './artist-create-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistCreatePage {
  private readonly router = inject(Router)
  private readonly http = inject(HttpClient)
  private readonly environment = inject(ENVIRONMENT)
  private readonly snackbar = inject(Snackbar)

  protected readonly saving = signal(false)
  protected readonly isDragging = signal(false)
  protected readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput')

  protected createArtist(artist: { name: string; genres: string[]; image: File }): void {
    this.http
      .post(`${this.environment.apiUrl}/catalog-management/artists`, artist)
      .pipe(
        switchMap((artistResponse) => {
          const artistId = (artistResponse as unknown as Contracts.Backstage.ArtistCreationResponse).artistId
          return this.http.get(`${this.environment.apiUrl}/catalog-management/artists/${artistId}/upload-token`)
        }),
        switchMap((uploadTokenResponse) => {
          const uploadToken = (uploadTokenResponse as unknown as Contracts.Media.UploadTokenResponse).uploadToken
          const formData = new FormData()
          formData.append('file', artist.image)
          return this.http.post(`${this.environment.apiUrl}/media/upload`, formData, {
            headers: {
              'x-upload-token': uploadToken,
            },
          })
        }),
      )
      .subscribe({
        next: () => {
          this.snackbar.info('Artist created successfully')
          this.router.navigate(['/catalog-management/artists'])
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
    this.router.navigate(['/catalog-management/artists'])
  }
}
