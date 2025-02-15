import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, output } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { LogoComponent } from '@neko/ui-shared/components'
import { ButtonDirective } from '@neko/ui-shared/directives'
import { ScrollService } from '@neko/ui-shared/services'

@Component({
  selector: 'neko-navigation-modal-drawer',
  imports: [ButtonDirective, LogoComponent, RouterLink, RouterLinkActive],
  templateUrl: './navigation-modal-drawer.component.html',
  styleUrl: './navigation-modal-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationModalDrawerComponent implements OnInit, OnDestroy {
  private readonly scrollService = inject(ScrollService)

  readonly toggleExpand = output<void>()

  ngOnInit(): void {
    this.scrollService.disable()
  }

  ngOnDestroy(): void {
    this.scrollService.enable()
  }
}
