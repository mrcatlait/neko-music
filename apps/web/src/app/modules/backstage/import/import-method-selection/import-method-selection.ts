import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router } from '@angular/router'

import { SoundCloudIcon, YoutubeIcon } from '../shared'

import { Button } from '@/shared/components'

@Component({
  selector: 'n-import-method-selection',
  templateUrl: './import-method-selection.html',
  styleUrl: './import-method-selection.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, YoutubeIcon, SoundCloudIcon],
})
export class ImportMethodSelection {
  private readonly router = inject(Router)

  importFromYoutube(): void {
    this.router.navigate(['/backstage/import/youtube'])
  }
}
