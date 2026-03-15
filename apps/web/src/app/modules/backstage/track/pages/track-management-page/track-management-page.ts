import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router } from '@angular/router'

import { Button } from '@/shared/components'

@Component({
  selector: 'n-track-management-page',
  templateUrl: './track-management-page.html',
  styleUrl: './track-management-page.scss',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackManagementPage {
  protected readonly router = inject(Router)

  protected createNew(): void {
    this.router.navigate(['/backstage/tracks/create'])
  }
}
