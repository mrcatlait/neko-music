import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'

import { AuthStore } from '@/core/stores'

ModuleRegistry.registerModules([AllCommunityModule])

@Component({
  selector: 'n-admin-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {
  private readonly authStore = inject(AuthStore)

  protected readonly displayName = computed(() => this.authStore.session()?.displayName ?? '')
}
