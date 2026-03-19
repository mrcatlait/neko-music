import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'n-checkbox',
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkbox {}
