import { ChangeDetectionStrategy, Component } from '@angular/core'

import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-not-found-page',
  imports: [SharedModule],
  templateUrl: 'not-found.component.html',
  styleUrl: 'not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundPage {}
