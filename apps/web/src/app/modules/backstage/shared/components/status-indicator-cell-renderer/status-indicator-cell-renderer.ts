import { TitleCasePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ICellRendererAngularComp } from 'ag-grid-angular'
import { ICellRendererParams } from 'ag-grid-community'

@Component({
  selector: 'n-status-indicator-cell-renderer',
  imports: [TitleCasePipe],
  template: `
    <span class="status-indicator-cell-renderer">
      <i [style.color]="color">
        {{ icon }}
      </i>
      <span>{{ params.value | titlecase }}</span>
    </span>
  `,
  styles: [
    `
      .status-indicator-cell-renderer {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusIndicatorCellRenderer implements ICellRendererAngularComp {
  protected params: ICellRendererParams = {} as ICellRendererParams

  protected icon = ''
  protected color = ''

  agInit(params: ICellRendererParams): void {
    this.params = params
    this.icon = this.getIcon()
    this.color = this.getColor()
  }

  refresh(): boolean {
    return true
  }

  protected getIcon(): string {
    switch (this.params.value) {
      case 'REVIEW':
        return 'clock_loader_40'
      case 'PUBLISHED':
        return 'check_circle'
      case 'REJECTED':
        return 'block'
      case 'DRAFT':
      default:
        return 'pending'
    }
  }

  protected getColor(): string {
    switch (this.params.value) {
      case 'REVIEW':
        return 'var(--color-status-normal)'
      case 'PUBLISHED':
        return 'var(--color-status-success)'
      case 'REJECTED':
        return 'var(--color-status-failed)'
      case 'DRAFT':
        return 'var(--color-status-pending)'
      default:
        return 'var(--color-status-undefined)'
    }
  }
}
