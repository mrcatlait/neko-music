import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ICellRendererAngularComp } from 'ag-grid-angular'
import { ICellRendererParams } from 'ag-grid-community'

import { Artist } from '../../models'

import { ArtworkPipe } from '@/shared/pipes'

type ArtistNameCellRendererParams = ICellRendererParams<Artist>

@Component({
  selector: 'n-artist-name-cell-renderer',
  imports: [ArtworkPipe],
  template: `
    <span class="artist-name-cell-renderer">
      @if (artworkUrl) {
        <img
          alt="Artist artwork"
          class="artist-name-cell-renderer-artwork"
          [src]="artworkUrl | artwork: 'small'"
        />
      } @else {
        <span class="artist-name-cell-renderer-placeholder">
          <i class="material-symbols-outlined">person</i>
        </span>
      }
      <span>{{ params.value }}</span>
    </span>
  `,
  styles: [
    `
      .artist-name-cell-renderer {
        display: flex;
        align-items: center;
        gap: 8px;

        &-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: var(--color-surface-container-high);
          border-radius: 50%;
        }

        &-artwork {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistNameCellRenderer implements ICellRendererAngularComp {
  protected params: ArtistNameCellRendererParams = {} as ArtistNameCellRendererParams

  protected artworkUrl = ''

  agInit(params: ArtistNameCellRendererParams): void {
    this.params = params
    this.artworkUrl = this.params.data?.artwork?.url ?? ''
  }

  refresh(): boolean {
    return true
  }
}
