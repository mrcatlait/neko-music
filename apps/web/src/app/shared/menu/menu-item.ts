import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'n-menu-item',
  template: ` <ng-content /> `,
  styles: `
    @use 'abstracts' as abstracts;

    n-menu-item {
      --n-menu-item-height: 48px;
      --n-menu-item-padding: 0 12px;
      --n-menu-item-color: var(--color-on-surface);

      cursor: pointer;
      height: var(--n-menu-item-height);
      display: flex;
      gap: 12px;
      align-items: center;
      color: var(--n-menu-item-color);
      padding: var(--n-menu-item-padding);

      @include abstracts.typography(label-large);
      @include abstracts.state(var(--n-menu-item-color));

      &[disabled] {
        cursor: default;
        --n-menu-item-color: var(--color-text-disabled);
      }
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuItem {}
