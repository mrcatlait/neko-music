import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
@Component({
  selector: 'neko-layout-minimal',
  imports: [RouterOutlet],
  templateUrl: 'layout-minimal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutMinimalComponent {}
