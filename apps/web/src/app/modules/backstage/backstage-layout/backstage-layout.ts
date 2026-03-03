import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'

import { AuthStore } from '@/core/auth'

@Component({
  selector: 'n-backstage-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './backstage-layout.html',
  styleUrl: './backstage-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackstageLayout {
  private readonly authStore = inject(AuthStore)

  protected readonly displayName = computed(() => this.authStore.session()?.displayName ?? '')
}
