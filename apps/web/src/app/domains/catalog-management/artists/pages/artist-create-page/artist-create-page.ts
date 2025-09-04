import { ChangeDetectionStrategy, Component, ElementRef, inject, resource, signal, viewChild } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { Contracts } from '@neko/contracts'

import { ArtistForm } from '../../components'

import { ENVIRONMENT } from '@/core/providers'
import { RECORD_STATUSES } from '@/domains/catalog-management/shared/enums'

@Component({
  selector: 'n-artist-create-page',
  imports: [ArtistForm],
  templateUrl: './artist-create-page.html',
  styleUrl: './artist-create-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistCreatePage {
  private readonly http = inject(HttpClient)
  private readonly environment = inject(ENVIRONMENT)

  protected readonly saving = signal(false)
  protected readonly isDragging = signal(false)
  protected readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput')

  protected readonly genresResource = resource({
    loader: () =>
      firstValueFrom(
        this.http.get<Contracts.CatalogManagement.GenreResponse[]>(
          `${this.environment.apiUrl}/catalog-management/genres?status=${RECORD_STATUSES.Published}`,
        ),
      ),
  })

  protected createArtist(artist: { name: string; genres: Contracts.CatalogManagement.GenreResponse[] }): void {
    console.log('Creating artist:', artist)
    console.log('Selected genres:', artist.genres.map((g) => g.name).join(', '))
  }

  protected cancel(): void {
    console.log('cancel')
  }

  // https://medium.com/ansh-mehra/how-to-design-an-upload-media-cta-the-right-way-904ef97e21ae

  protected browseFiles(): void {
    this.fileInput()?.nativeElement.click()
  }

  protected drop(event: DragEvent): void {
    event.preventDefault()
    this.isDragging.set(false)

    const files = event.dataTransfer?.files

    const fileInput = this.fileInput()?.nativeElement

    if (files && fileInput) {
      fileInput.files = files
    }
  }

  protected dragover(event: DragEvent): void {
    event.preventDefault()
    this.isDragging.set(true)
  }

  protected dragleave(event: DragEvent): void {
    event.preventDefault()
    this.isDragging.set(false)
  }
}
