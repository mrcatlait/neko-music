import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ICellRendererAngularComp } from 'ag-grid-angular'
import { ICellRendererParams } from 'ag-grid-community'

import { RecordStatusBadge } from '../record-status-badge/record-status-badge'

@Component({
  selector: 'n-record-status-cell-renderer',
  imports: [RecordStatusBadge],
  template: ` <n-record-status-badge [status]="params.value" /> `,
  styles: `
    :host {
      height: 100%;
      display: flex;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordStatusCellRenderer implements ICellRendererAngularComp {
  protected params: ICellRendererParams = {} as ICellRendererParams

  agInit(params: ICellRendererParams): void {
    this.params = params
  }

  refresh(): boolean {
    return true
  }
}
