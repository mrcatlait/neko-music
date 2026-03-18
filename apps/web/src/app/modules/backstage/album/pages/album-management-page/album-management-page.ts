import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router } from '@angular/router'

import { Button } from '@/shared/components'

@Component({
  selector: 'n-album-management-page',
  imports: [Button],
  templateUrl: './album-management-page.html',
  styleUrl: './album-management-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbumManagementPage {
  protected readonly router = inject(Router)

  protected createNew(): void {
    this.router.navigate(['/backstage/albums/create'])
  }
}
