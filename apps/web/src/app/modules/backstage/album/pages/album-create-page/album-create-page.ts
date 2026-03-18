import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core'
import { Router } from '@angular/router'
import { switchMap } from 'rxjs'

import { AlbumForm } from '../../components'
import { AlbumApi } from '../../album-api'

import { IconButton } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'
import { MediaApi } from '@/modules/backstage/shared/services'
import { AlbumType } from '@/shared/enums'

@Component({
  selector: 'n-album-create-page',
  imports: [AlbumForm, IconButton],
  templateUrl: './album-create-page.html',
  styleUrl: './album-create-page.scss',
  providers: [AlbumApi, MediaApi],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumCreatePage {
  private readonly router = inject(Router)
  private readonly snackbar = inject(Snackbar)
  private readonly albumApi = inject(AlbumApi)
  private readonly mediaApi = inject(MediaApi)

  protected readonly saving = signal(false)
  protected readonly isDragging = signal(false)
  protected readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput')

  protected createAlbum(album: { name: string; genres: string[]; image: File | null }): void {
    if (!album.image) return

    this.albumApi
      .create({
        name: album.name,
        genres: album.genres,
        releaseDate: new Date().toISOString(),
        type: AlbumType.Album,
        explicit: false,
        artists: [],
        tracks: [],
      })
      .pipe(
        switchMap(({ uploadToken }) => {
          return this.mediaApi.upload(album.image!, uploadToken)
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

  protected navigateToAlbumList(): void {
    this.router.navigate(['/backstage/albums'])
  }
}
