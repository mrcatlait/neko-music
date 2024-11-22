import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-logo',
  templateUrl: './logo.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {}
