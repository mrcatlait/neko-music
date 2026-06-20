import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ICellRendererAngularComp } from 'ag-grid-angular'
import { ICellRendererParams } from 'ag-grid-community'

import { ImportSourceChip } from '../../../shared'

@Component({
  selector: 'n-import-source-cell-renderer',
  template: ` <n-import-source-chip [dataSource]="params.value" /> `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      height: 100%;
    }
  `,
  imports: [ImportSourceChip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportSourceCellRenderer implements ICellRendererAngularComp {
  protected params: ICellRendererParams = {} as ICellRendererParams

  agInit(params: ICellRendererParams): void {
    this.params = params
  }

  refresh(): boolean {
    return true
  }
}
