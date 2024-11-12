import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-dialog-content',
  template: '<ng-content />',
  styleUrl: 'dialog-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentComponent {}
