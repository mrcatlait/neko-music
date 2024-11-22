import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-layout-minimal',
  templateUrl: 'layout-minimal.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutMinimalComponent {}
