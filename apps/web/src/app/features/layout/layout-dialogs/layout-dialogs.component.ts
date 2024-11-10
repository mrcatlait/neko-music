import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'

import { DIALOGS } from '@core/tokens'
import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-layout-dialogs',
  templateUrl: 'layout-dialogs.component.html',
  styleUrl: 'layout-dialogs.component.scss',
  imports: [SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutDialogsComponent {
  readonly dialogs = inject(DIALOGS)

  readonly hasDialogs = computed(() => this.dialogs().length > 0)
}
