import { GridApi, GridOptions, GridReadyEvent, IRowNode } from 'ag-grid-community'

import { DEFAULT_GRID_OPTIONS } from '../constants'

/**
 * The AgGridService class is responsible for managing the Ag-Grid instance and providing methods to interact with the grid.
 * It is a base class for all grid services and provides a common interface for interacting with the grid.
 *
 * @example
 * ```typescript
 * class ArtistTableService extends AgGridService<Artist> {}
 * ```
 */
export class AgGridService<T> {
  protected api: GridApi | null = null

  protected gridReady = false
  protected defaultRowData: T[] = []

  /**
   * The grid default options for the grid.
   */
  gridOptions: GridOptions<T> = {
    ...DEFAULT_GRID_OPTIONS,
    onGridReady: (event) => this.onGridReady(event),
    onGridPreDestroyed: () => this.onGridPreDestroyed(),
    rowData: [],
  }

  /**
   * Sets initial row data for the grid.
   * @param rowData - The row data to set.
   */
  setRowData(rowData: T[]): void {
    // Deep clone the row data to avoid mutating the original data
    this.defaultRowData = JSON.parse(JSON.stringify(rowData))

    this.updateRowData(rowData)
  }

  /**
   * Updates the row data for the grid.
   * @param rowData - The row data to update.
   */
  updateRowData(rowData: T[]): void {
    if (this.gridReady) {
      this.api?.updateGridOptions({
        rowData,
      })
    } else {
      this.gridOptions.rowData = rowData
    }
  }

  /**
   * Gets the row data for the grid.
   * @returns The row data.
   */
  getRowData(): T[] {
    const rowData: T[] = []

    this.getRowNodes().forEach(({ data }) => {
      if (!data) {
        return
      }

      rowData.push(data)
    })

    return rowData
  }

  /**
   * Gets the row Ag-Grid nodes for the grid.
   * @returns The row nodes.
   */
  getRowNodes(): IRowNode<T>[] {
    const nodes: IRowNode<T>[] = []

    const filterModel = this.api?.getFilterModel()

    if (filterModel) {
      this.api?.setFilterModel(null)
      this.api?.onFilterChanged()
    }

    this.api?.forEachNodeAfterFilterAndSort((node) => {
      nodes.push(node)
    })

    if (filterModel) {
      this.api?.setFilterModel(filterModel)
      this.api?.onFilterChanged()
    }

    return nodes
  }

  /**
   * Sets the grid options for the grid.
   * @param options - The grid options to set.
   */
  setGridOptions(options: GridOptions<T>): void {
    this.api?.updateGridOptions(options)
  }

  /**
   * Handles the grid ready event.
   * @param event - The grid ready event.
   */
  private onGridReady(event: GridReadyEvent): void {
    this.api = event.api
    this.gridReady = true
  }

  /**
   * Handles the grid pre-destroyed event.
   */
  private onGridPreDestroyed(): void {
    this.api = null
    this.gridReady = false
  }
}
