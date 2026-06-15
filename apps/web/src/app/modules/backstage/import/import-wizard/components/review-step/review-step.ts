import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core'
import { AgGridAngular } from 'ag-grid-angular'
import { AllCommunityModule, ColDef, GridApi, GridOptions } from 'ag-grid-community'

import { Button } from '@/shared/components'
import { GRID_OPTIONS, provideGridOptions } from '@/modules/backstage/shared/providers'

@Component({
  selector: 'n-review-step',
  templateUrl: './review-step.html',
  styleUrl: './review-step.scss',
  imports: [Button, AgGridAngular],
  providers: [provideGridOptions()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStep {
  protected readonly defaultGridOptions = inject(GRID_OPTIONS)
  protected gridApi?: GridApi

  readonly navigateBack = output<void>()
  readonly startImport = output<{ selectedItemIds: string[] }>()
  readonly refreshRequested = output<void>()
  readonly tracks = input<
    {
      id: string
      sourceItemRef: string
      label: string
      position: number
      isSelected: boolean
    }[]
  >([])
  readonly newSourceItemRefs = input<string[]>([])
  readonly removedSourceItemRefs = input<string[]>([])
  readonly isRefreshing = input<boolean>(false)

  protected readonly gridOptions: GridOptions = {
    ...this.defaultGridOptions,
    suppressCellFocus: true,
    rowSelection: {
      mode: 'multiRow',
    },
    onGridReady: (event) => {
      this.gridApi = event.api
      this.syncRowSelection()
    },
    onFirstDataRendered: () => {
      this.syncRowSelection()
    },
    onRowClicked: (event) => {
      event.api.setNodesSelected({
        nodes: [event.node],
        newValue: !event.node.isSelected(),
      })
    },
  }

  protected readonly modules = [AllCommunityModule]

  protected readonly columnDefs: ColDef<any>[] = [
    { field: 'label', headerName: 'Track', flex: 1 },
    { field: 'position', headerName: 'Position', width: 120 },
    {
      field: 'sourceItemRef',
      headerName: 'Source link',
      flex: 1,
      cellStyle: { color: 'var(--color-text-medium-emphasis)' },
    },
  ]

  protected continue() {
    const selectedRows = this.gridApi?.getSelectedRows() ?? []
    const selectedItemIds = selectedRows.map((row) => row.id as string)

    this.startImport.emit({ selectedItemIds })
  }

  protected refresh() {
    this.refreshRequested.emit()
  }

  protected previous() {
    this.navigateBack.emit()
  }

  private syncRowSelection() {
    const api = this.gridApi

    if (!api) {
      return
    }

    api.deselectAll()

    const selectedNodes: any[] = []

    api.forEachNode((node) => {
      if (node.data?.isSelected) {
        selectedNodes.push(node)
      }
    })

    if (selectedNodes.length > 0) {
      api.setNodesSelected({
        nodes: selectedNodes,
        newValue: true,
      })
    }
  }
}
