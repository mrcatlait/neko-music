import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'n-textfield',
  templateUrl: 'textfield.html',
  styleUrl: 'textfield.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Textfield {}
