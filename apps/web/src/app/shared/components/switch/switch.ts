import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'n-switch',
  templateUrl: './switch.html',
  styleUrl: './switch.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Switch {}
