import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core'
import { FormField, FormRoot } from '@angular/forms/signals'

import { GenreAutocomplete, PictureUpload } from '../../shared/components'
import { ArtistEditorStore, provideArtistEditorStore } from './artist-editor-store'

import { ArtworkPipe } from '@/shared/pipes'
import { Button, Checkbox, IconButton, LoadingIndicator, Textfield } from '@/shared/components'

@Component({
  selector: 'n-artist-editor',
  imports: [
    ArtworkPipe,
    Button,
    FormRoot,
    IconButton,
    Checkbox,
    LoadingIndicator,
    FormField,
    PictureUpload,
    Textfield,
    GenreAutocomplete,
  ],
  templateUrl: './artist-editor.html',
  styleUrl: './artist-editor.scss',
  providers: [provideArtistEditorStore()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistEditor implements OnInit {
  private readonly artistEditorStore = inject(ArtistEditorStore)

  readonly id = input<string>()

  protected readonly isBusy = this.artistEditorStore.isBusy
  protected readonly artistForm = this.artistEditorStore.artistForm
  protected readonly existingArtworkUrl = this.artistEditorStore.existingArtworkUrl

  ngOnInit(): void {
    const artistId = this.id()

    if (!artistId) {
      return
    }

    this.artistEditorStore.loadArtistForEditing(artistId)
  }

  protected navigateToArtistList(): void {
    this.artistEditorStore.navigateToArtistList()
  }

  protected cancel(): void {
    this.artistEditorStore.navigateToArtistList()
  }
}
