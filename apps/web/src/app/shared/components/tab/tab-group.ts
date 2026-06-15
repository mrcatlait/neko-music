import { NgTemplateOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, computed, contentChildren, signal } from '@angular/core'

import { Tab } from './tab'

@Component({
  selector: 'n-tab-group',
  imports: [NgTemplateOutlet],
  templateUrl: './tab-group.html',
  styleUrl: './tab-group.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabGroup {
  protected readonly selectedTabIndex = signal(0)
  protected readonly tabs = contentChildren(Tab)

  protected readonly selectedTab = computed(() => {
    const currentTabs = this.tabs()

    if (currentTabs.length === 0) {
      return null
    }

    const safeIndex = Math.min(this.selectedTabIndex(), currentTabs.length - 1)

    return currentTabs[safeIndex] ?? null
  })

  protected selectTab(index: number): void {
    this.selectedTabIndex.set(index)
  }
}
