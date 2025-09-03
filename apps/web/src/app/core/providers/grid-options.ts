import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core'
import { GridOptions, themeMaterial } from 'ag-grid-community'

export const GRID_OPTIONS = new InjectionToken<GridOptions>('GRID_OPTIONS')

export const DEFAULT_GRID_OPTIONS: GridOptions = {
  singleClickEdit: true,
  stopEditingWhenCellsLoseFocus: true,
  theme: themeMaterial.withParams({
    primaryColor: 'var(--color-primary)',
    backgroundColor: 'var(--color-surface)',
    textColor: 'var(--color-text-high-emphasis)',
    headerTextColor: 'var(--color-text-medium-emphasis)',
    fontFamily: 'var(--typography-font-family)',
    fontSize: 'var(--typography-body-large-size)',
    headerFontSize: 'var(--typography-body-large-size)',
    headerFontWeight: 'var(--typography-body-large-weight)',
    rowHoverColor: 'var(--color-surface-container-high)',
    headerCellHoverBackgroundColor: 'var(--color-surface-container-high)',
    rowHeight: 48,
    wrapperBorderRadius: 'var(--shape-corner-medium)',
    borderWidth: 1,
    borderColor: 'var(--color-outline)',
    borderRadius: 'var(--shape-corner-medium)',
    wrapperBorder: true,
    // Checkbox
    checkboxCheckedBorderColor: 'var(--color-primary)',
    checkboxCheckedBackgroundColor: 'var(--color-primary)',
    checkboxCheckedShapeColor: 'var(--color-text-high-emphasis)',
    checkboxUncheckedBorderColor: 'var(--color-text-medium-emphasis)',
  }),
  // defaultColDef: {
  //   cellRenderer: AgGridCellRendererComponent,
  //   cellDataType: false,
  // },
}

export const provideGridOptions = (): EnvironmentProviders =>
  makeEnvironmentProviders([{ provide: GRID_OPTIONS, useValue: DEFAULT_GRID_OPTIONS }])
