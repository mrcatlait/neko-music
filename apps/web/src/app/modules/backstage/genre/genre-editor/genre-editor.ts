import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core'
import { FormField, FormRoot } from '@angular/forms/signals'

import { GenreEditorStore, provideGenreEditorStore } from './genre-editor-store'

import { Button, IconButton, LoadingIndicator, Textfield } from '@/shared/components'

@Component({
  selector: 'n-genre-editor',
  imports: [Button, IconButton, FormField, FormRoot, LoadingIndicator, Textfield],
  templateUrl: './genre-editor.html',
  styleUrl: './genre-editor.scss',
  providers: provideGenreEditorStore(),
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenreEditor implements OnInit {
  private readonly genreEditorStore = inject(GenreEditorStore)

  readonly genreId = input<string>()

  protected readonly title = computed(() => (this.genreId() ? 'Edit Genre' : 'Create Genre'))

  protected readonly loading = this.genreEditorStore.loading
  protected readonly genreForm = this.genreEditorStore.genreForm

  ngOnInit(): void {
    const genreId = this.genreId()

    if (!genreId) {
      return
    }

    this.genreEditorStore.fetchGenre(genreId)
  }

  protected navigateToGenreList(): void {
    this.genreEditorStore.navigateToGenreList()
  }

  protected cancel(): void {
    this.genreEditorStore.navigateToGenreList()
  }
}
