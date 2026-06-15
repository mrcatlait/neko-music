import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'

import { IconButton } from '@/shared/components'

@Component({
  selector: 'n-search',
  templateUrl: './search.html',
  styleUrl: './search.scss',
  imports: [IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
  protected readonly query = signal<string>('')

  protected readonly showClear = computed(() => this.query().length > 0)
}
