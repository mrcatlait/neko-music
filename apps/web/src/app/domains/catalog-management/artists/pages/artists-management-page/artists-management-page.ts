import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router } from '@angular/router'

import { ArtistTable } from '../../components'

import { Button } from '@/shared/components'

@Component({
  selector: 'n-artists-management-page',
  imports: [ArtistTable, Button],
  templateUrl: './artists-management-page.html',
  styleUrl: './artists-management-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistsManagementPage {
  protected readonly router = inject(Router)

  protected createNew(): void {
    this.router.navigate(['/catalog-management/artists/create'])
  }
}
