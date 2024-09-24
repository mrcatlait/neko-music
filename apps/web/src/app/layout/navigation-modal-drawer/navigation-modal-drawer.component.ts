import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'

import { ScrollService } from '@core/services'
import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-navigation-modal-drawer',
  templateUrl: './navigation-modal-drawer.component.html',
  styleUrl: './navigation-modal-drawer.component.scss',
  imports: [RouterLinkActive, RouterLink, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationModalDrawerComponent implements OnInit, OnDestroy {
  private readonly scrollService = inject(ScrollService)

  @Output() collapse = new EventEmitter<void>()

  ngOnInit(): void {
    this.scrollService.disable()
  }

  ngOnDestroy(): void {
    this.scrollService.enable()
  }
}
