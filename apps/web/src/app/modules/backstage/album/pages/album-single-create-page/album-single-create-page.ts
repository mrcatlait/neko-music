import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { Contracts } from '@neko/contracts'
import { finalize, forkJoin, switchMap } from 'rxjs'

import { AlbumForm, type AlbumModel } from '../../components'
import { AlbumApi } from '../../album-api'

import { IconButton } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'
import { MediaApi } from '@/modules/backstage/shared/services'
import { AlbumType, ArtistRole, TrackType } from '@/shared/enums'

@Component({
  selector: 'n-album-single-create-page',
  imports: [AlbumForm, IconButton],
  templateUrl: './album-single-create-page.html',
  styleUrl: './album-single-create-page.scss',
  providers: [AlbumApi, MediaApi],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumSingleCreatePage {
  private readonly router = inject(Router)
  private readonly snackbar = inject(Snackbar)
  private readonly albumApi = inject(AlbumApi)
  private readonly mediaApi = inject(MediaApi)

  protected readonly saving = signal(false)

  protected createSingle(album: AlbumModel): void {
    if (!album.image || !album.audio) return

    this.saving.set(true)

    const releaseDate = new Date().toISOString()

    const payload: Contracts.Backstage.Albums.CreationRequest = {
      name: album.name,
      genres: album.genres,
      releaseDate,
      type: AlbumType.Single,
      explicit: album.explicit,
      artists: album.artists.map((a) => ({ id: a, role: ArtistRole.Primary })),
      tracks: [
        {
          name: album.name,
          releaseDate,
          diskNumber: 1,
          trackNumber: 1,
          type: TrackType.Original,
          explicit: album.explicit,
          genres: album.genres,
          artists: album.artists.map((a) => ({ id: a, role: ArtistRole.Primary })),
        },
      ],
    }

    this.albumApi
      .create(payload)
      .pipe(
        switchMap((res) =>
          forkJoin([
            this.mediaApi.upload(album.image!, res.uploadToken),
            this.mediaApi.upload(album.audio!, res.tracks[0].uploadToken),
          ]),
        ),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: () => {
          this.snackbar.info('Single created successfully')
          this.router.navigate(['/backstage/albums'])
        },
        error: () => {
          this.snackbar.info('Failed to create single')
        },
      })
  }

  protected navigateToKindChooser(): void {
    this.router.navigate(['/backstage/albums/create'])
  }
}
