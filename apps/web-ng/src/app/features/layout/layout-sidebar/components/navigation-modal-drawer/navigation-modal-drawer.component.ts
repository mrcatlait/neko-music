import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core'
import { Permission } from '@neko/permissions'
import { NgIf } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'

import { ScrollService } from '@core/services'
import { SelectorDirective } from '@shared/directives'
import { LogoComponent } from '@shared/components'

@Component({
  selector: 'neko-navigation-modal-drawer',
  templateUrl: './navigation-modal-drawer.component.html',
  styleUrl: './navigation-modal-drawer.component.scss',
  imports: [SelectorDirective, NgIf, LogoComponent, RouterLink, RouterLinkActive],
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
