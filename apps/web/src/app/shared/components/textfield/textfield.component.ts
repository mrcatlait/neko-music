import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-textfield',
  templateUrl: 'textfield.component.html',
  styleUrl: 'textfield.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextfieldComponent {}
