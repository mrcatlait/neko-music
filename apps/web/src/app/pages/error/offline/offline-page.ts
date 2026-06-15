import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'

import { Button } from '@/shared/components'

@Component({
  selector: 'n-offline-page',
  imports: [Button, RouterLink],
  templateUrl: './offline-page.html',
  styleUrl: './offline-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflinePage {
  protected reloadPage(): void {
    window.location.reload()
  }
}
