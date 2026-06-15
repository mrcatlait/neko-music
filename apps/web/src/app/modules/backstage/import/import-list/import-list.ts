import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { Router } from '@angular/router'

import { YoutubeIcon } from '../shared'

import { Button, Tab, TabGroup, CircularProgress } from '@/shared/components'
import { GetImportsGql, GetImportsQuery } from '@/shared/generated-types'

// https://dribbble.com/shots/21601453-TimeTracker-Data-Stat-Cards
// https://dribbble.com/shots/19285385-Sentiment-Card-Community-Insights
// https://dribbble.com/shots/24986226-UI-Cards-Concept-For-Traveling

@Component({
  selector: 'n-import-list',
  templateUrl: './import-list.html',
  styleUrl: './import-list.scss',
  imports: [Button, TabGroup, Tab, YoutubeIcon, CircularProgress],
  providers: [GetImportsGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportList {
  private readonly router = inject(Router)
  private readonly getImportsGql = inject(GetImportsGql)

  protected readonly importsResource = this.getImportsGql.graphqlResource({})
  protected readonly imports = computed(() => this.importsResource.value()?.imports ?? [])
  protected readonly inProgressImports = computed(() =>
    this.imports().filter((job) => ['pending', 'in_progress', 'cancel_requested'].includes(job.status)),
  )
  protected readonly completedImports = computed(() =>
    this.imports().filter((job) => ['completed', 'failed', 'canceled'].includes(job.status)),
  )

  protected createNew(): void {
    this.router.navigate(['/backstage/import/new'])
  }

  protected navigateToImport(importId: string): void {
    this.router.navigate(['/backstage/import', importId])
  }

  protected isYoutubeImport(job: GetImportsQuery['imports'][number]): boolean {
    return job.dataSource === 'youtube'
  }
}
