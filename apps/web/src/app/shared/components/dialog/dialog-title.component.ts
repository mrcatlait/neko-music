import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-dialog-title',
  templateUrl: 'dialog-title.component.html',
  styleUrl: 'dialog-title.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogTitleComponent {}