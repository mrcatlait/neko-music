import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import { ICellRendererAngularComp } from 'ag-grid-angular'
import { ICellRendererParams } from 'ag-grid-community'

import { StatusIndicator } from '@/shared/components/status-indicator/status-indicator-next'

const STATUS_MAP: Record<string, any> = {
  failed: 'failed',
  in_progress: 'progress',
  completed: 'succeeded',
  pending: 'pending',
  cancel_requested: 'pending',
  canceled: 'failed',
}

@Component({
  selector: 'n-import-status-cell-renderer',
  template: `<n-status-indicator [status]="normalizedStatus()">{{ label() }}</n-status-indicator>`,
  styles: `
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
  imports: [StatusIndicator],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportStatusCellRenderer implements ICellRendererAngularComp {
  protected readonly status = signal('')
  protected readonly label = signal('')
  protected readonly normalizedStatus = computed(() => STATUS_MAP[this.status()])

  agInit(params: ICellRendererParams): void {
    this.updateState(params)
  }

  refresh(params: ICellRendererParams): boolean {
    this.updateState(params)

    return true
  }

  private updateState(params: ICellRendererParams): void {
    const rawStatus = String(params.value ?? '')
    const errorMessage = String((params.data as { errorMessage?: string } | undefined)?.errorMessage ?? '')
    const isHardDuplicate = rawStatus === 'completed' && errorMessage === 'hard_duplicate'

    this.status.set(rawStatus)
    this.label.set(isHardDuplicate ? 'skipped' : rawStatus)
  }
}
