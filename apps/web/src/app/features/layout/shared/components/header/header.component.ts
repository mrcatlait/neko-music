import { ChangeDetectionStrategy, Component, output } from '@angular/core'
import { LogoComponent } from '@neko/ui-shared/components'

@Component({
  selector: 'neko-header',
  imports: [LogoComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
