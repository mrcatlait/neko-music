import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-dialog-actions',
  template: '<ng-content />',
  styleUrl: 'dialog-actions.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogActionsComponent {}
