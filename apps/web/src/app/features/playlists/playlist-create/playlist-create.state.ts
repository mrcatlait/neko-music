import { inject, Injectable, signal } from '@angular/core'
import { take } from 'rxjs'

import { CreatePlaylistDto } from '@core/dto'
import { PlaylistRepository } from '@core/repositories'

@Injectable()
export class PlaylistCreateState {
  private readonly repository = inject(PlaylistRepository)

  readonly loading = signal(false)
  readonly error = signal<Error | null>(null)

  create(payload: CreatePlaylistDto) {
    this.loading.set(true)

    this.repository
      .createPlaylist(payload)
      .pipe(take(1))
      .subscribe({
        next: () => this.loading.set(false),
        error: (error) => this.handleError(error),
      })
  }

  private handleError(error: Error): void {
    this.loading.set(false)
    this.error.set(error)
  }
}
