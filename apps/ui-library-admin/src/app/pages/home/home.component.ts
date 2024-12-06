import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  standalone: true,
  selector: 'neko-home-page',
  imports: [],
  templateUrl: 'home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
