import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'

import { Button } from '@/shared/components'

@Component({
  selector: 'n-server-error-page',
  imports: [Button, RouterLink],
  templateUrl: './server-error-page.html',
  styleUrl: './server-error-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerErrorPage {
  protected reloadPage(): void {
    window.location.reload()
  }
}
