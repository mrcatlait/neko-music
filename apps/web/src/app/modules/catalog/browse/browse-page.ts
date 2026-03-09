import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'n-browse-page',
  template: ` <h1>Browse</h1>
    <div style="height: 2000px;"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowsePage {}
