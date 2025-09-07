import { ChangeDetectionStrategy, Component, ElementRef, inject, resource, signal, viewChild } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

import { ArtistForm } from '../../components'

import { ENVIRONMENT } from '@/core/providers'
import { Button } from '@/shared/components'

@Component({
  selector: 'n-artist-create-page',
  imports: [ArtistForm, Button],
  templateUrl: './artist-create-page.html',
  styleUrl: './artist-create-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistCreatePage {
  protected readonly router = inject(Router)

  protected readonly saving = signal(false)
  protected readonly isDragging = signal(false)
  protected readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput')

  protected createArtist(artist: { name: string; genres: string[] }): void {
    console.log('Creating artist:', artist)
    console.log('Selected genres:', artist.genres.join(', '))
  }

  protected cancel(): void {
    console.log('cancel')
  }

  protected navigateToArtistList(): void {
    this.router.navigate(['/catalog-management/artists'])
  }
}
