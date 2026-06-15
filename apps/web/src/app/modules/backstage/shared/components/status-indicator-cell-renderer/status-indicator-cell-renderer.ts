import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ICellRendererAngularComp } from 'ag-grid-angular'
import { ICellRendererParams } from 'ag-grid-community'

import { StatusIndicator } from '@/shared/components'

@Component({
  selector: 'n-status-indicator-cell-renderer',
  imports: [StatusIndicator],
  template: ` <n-status-indicator [status]="params.value" /> `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        height: 100%;
      }

      n-status-indicator {
        display: inline-flex;
        align-items: center;
        height: fit-content;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusIndicatorCellRenderer implements ICellRendererAngularComp {
  protected params: ICellRendererParams = {} as ICellRendererParams

  agInit(params: ICellRendererParams): void {
    this.params = params
  }

  refresh(): boolean {
    return true
  }
}
