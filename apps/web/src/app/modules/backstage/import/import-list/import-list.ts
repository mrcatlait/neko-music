import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { Router } from '@angular/router'
import { AgGridAngular } from 'ag-grid-angular'
import { AllCommunityModule, ColDef, GridOptions } from 'ag-grid-community'

import { GRID_OPTIONS, provideGridOptions } from '../../shared/providers'
import { ImportSourceCellRenderer, ImportStatusCellRenderer } from './components'

import { Button } from '@/shared/components'
import { GetImportsGql, GetImportsQuery } from '@/shared/generated-types'

// https://dribbble.com/shots/21601453-TimeTracker-Data-Stat-Cards
// https://dribbble.com/shots/19285385-Sentiment-Card-Community-Insights
// https://dribbble.com/shots/24986226-UI-Cards-Concept-For-Traveling

@Component({
  selector: 'n-import-list',
  templateUrl: './import-list.html',
  styleUrl: './import-list.scss',
  imports: [AgGridAngular, Button],
  providers: [GetImportsGql, provideGridOptions()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportList {
  private readonly defaultGridOptions = inject(GRID_OPTIONS)
  private readonly router = inject(Router)
  private readonly getImportsGql = inject(GetImportsGql)

  protected readonly importsResource = this.getImportsGql.graphqlResource({})
  protected readonly imports = computed(() => this.importsResource.value()?.imports ?? [])

  protected readonly gridOptions: GridOptions = {
    ...this.defaultGridOptions,
    onRowClicked: (event) => {
      this.router.navigate(['/backstage/import', event.data.id])
    },
  }

  protected readonly modules = [AllCommunityModule]
  protected readonly columnDefs: ColDef<GetImportsQuery['imports'][number]>[] = [
    { field: 'status', headerName: 'Status', cellRenderer: ImportStatusCellRenderer },
    { field: 'label', headerName: 'Label', minWidth: 320, flex: 3, tooltipField: 'label' },
    { field: 'dataSource', headerName: 'Data source', cellRenderer: ImportSourceCellRenderer },
    { field: 'totalItems', headerName: 'Total items', width: 150 },
    { field: 'completedItems', headerName: 'Completed', width: 150 },
    { field: 'failedItems', headerName: 'Failed', width: 150 },
    { field: 'pendingReviewItems', headerName: 'Pending review items', width: 150 },
    { field: 'progressPercent', headerName: 'Progress', width: 150 },
    { field: 'createdAt', headerName: 'Created at', width: 150 },
    { field: 'startedAt', headerName: 'Started at', width: 150 },
    { field: 'completedAt', headerName: 'Completed at', width: 150 },
  ]

  protected createNew(): void {
    this.router.navigate(['/backstage/import/new'])
  }
}
