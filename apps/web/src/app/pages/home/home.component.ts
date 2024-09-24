import { ChangeDetectionStrategy, Component } from '@angular/core'

import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-home',
  imports: [SharedModule],
  templateUrl: 'home.component.html',
  styleUrl: 'home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
