import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ICellRendererAngularComp } from 'ag-grid-angular'
import { ICellRendererParams } from 'ag-grid-community'

import { StatusIndicator } from '@/shared/components'

@Component({
  selector: 'n-import-status-cell-renderer',
  template: `@switch (params.value) {
    @case ('failed') {
      <n-status-indicator status="failed" />
    }
    @case ('in_progress') {
      <n-status-indicator status="in_progress" />
    }
  }`,
  imports: [StatusIndicator],
  styles: `
    :host {
      display: flex;
      align-items: center;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportStatusCellRenderer implements ICellRendererAngularComp {
  protected params: ICellRendererParams = {} as ICellRendererParams

  agInit(params: ICellRendererParams): void {
    this.params = params
  }

  refresh(): boolean {
    return true
  }
}
