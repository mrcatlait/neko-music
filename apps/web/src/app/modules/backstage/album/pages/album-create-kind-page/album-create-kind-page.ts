import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router, RouterLink } from '@angular/router'

import { IconButton } from '@/shared/components'

@Component({
  selector: 'n-album-create-kind-page',
  imports: [IconButton, RouterLink],
  templateUrl: './album-create-kind-page.html',
  styleUrl: './album-create-kind-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumCreateKindPage {
  private readonly router = inject(Router)

  protected navigateToAlbumList(): void {
    this.router.navigate(['/backstage/albums'])
  }
}
