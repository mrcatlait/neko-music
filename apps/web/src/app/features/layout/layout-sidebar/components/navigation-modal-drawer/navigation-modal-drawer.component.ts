import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { Permission } from '@neko/permissions'
import { ButtonDirective } from '@neko/ui-shared/directives'
import { PermissionDirective } from '@neko/ui-auth'
import { ScrollService } from '@neko/ui-shared/services'

import { LogoComponent } from '@shared/components'

@Component({
  selector: 'neko-navigation-modal-drawer',
  imports: [RouterLink, RouterLinkActive, LogoComponent, ButtonDirective, PermissionDirective],
  templateUrl: './navigation-modal-drawer.component.html',
  styleUrl: './navigation-modal-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationModalDrawerComponent implements OnInit, OnDestroy {
  private readonly scrollService = inject(ScrollService)

  @Output() collapse = new EventEmitter<void>()

  readonly permissions = Permission

  ngOnInit(): void {
    this.scrollService.disable()
  }

  ngOnDestroy(): void {
    this.scrollService.enable()
  }
}
