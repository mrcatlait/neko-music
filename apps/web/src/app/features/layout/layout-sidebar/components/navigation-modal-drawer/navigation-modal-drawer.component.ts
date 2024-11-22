import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core'
import { Permission } from '@neko/permissions'

import { ScrollService } from '@core/services'

@Component({
  selector: 'neko-navigation-modal-drawer',
  templateUrl: './navigation-modal-drawer.component.html',
  styleUrl: './navigation-modal-drawer.component.scss',
  standalone: false,
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
