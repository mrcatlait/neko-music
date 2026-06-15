import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'

import { ImportStartedIllustration } from '../import-started-illustration/import-started-illustration'

import { Button } from '@/shared/components'

@Component({
  selector: 'n-import-started',
  templateUrl: './import-started.html',
  styleUrl: './import-started.scss',
  imports: [Button, ImportStartedIllustration, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportStarted {}
