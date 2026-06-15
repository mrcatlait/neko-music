import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core'
import { Router } from '@angular/router'

import { Button, Tab, TabGroup } from '@/shared/components'

type ImportStatus = 'queued' | 'analyzing' | 'needs_review' | 'ready' | 'publishing' | 'published' | 'failed'
type ImportTab = 'todo' | 'completed'

interface ImportOverviewItem {
  id: string
  label: string
  sourceType: string
  sourceLabel: string
  tracksTotal: number
  tracksReady: number
  tracksNeedsReview: number
  tracksFailed: number
  progress: number
  status: ImportStatus
  updatedAtLabel: string
}

interface ImportSourceGroup {
  sourceType: string
  sourceLabel: string
  imports: ImportOverviewItem[]
}

@Component({
  selector: 'n-import-list',
  templateUrl: './import-list.html',
  styleUrl: './import-list.scss',
  imports: [Button, TabGroup, Tab],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportList {
  private readonly router = inject(Router)
  protected readonly selectedItems = signal<string[]>([])

  protected readonly items = signal<ImportOverviewItem[]>([
    {
      id: '2ffb4bb9-e423-4d6b-a5cc-2f8479f7f6d6',
      label: 'Workout Mix',
      sourceType: 'youtube_playlist',
      sourceLabel: 'YouTube playlist',
      tracksTotal: 248,
      tracksReady: 180,
      tracksNeedsReview: 12,
      tracksFailed: 2,
      progress: 72,
      status: 'analyzing',
      updatedAtLabel: '2 min ago',
    },
    {
      id: 'c0b1b1a0-b0db-4588-94cb-1f3d593402ac',
      label: 'Road Trip 2000s',
      sourceType: 'youtube_playlist',
      sourceLabel: 'YouTube playlist',
      tracksTotal: 96,
      tracksReady: 48,
      tracksNeedsReview: 4,
      tracksFailed: 0,
      progress: 51,
      status: 'needs_review',
      updatedAtLabel: '7 min ago',
    },
    {
      id: 'f1ba8f50-2948-47a6-b6cb-efc5e4317868',
      label: 'NAS Music',
      sourceType: 'local_folder',
      sourceLabel: 'Local folder',
      tracksTotal: 532,
      tracksReady: 532,
      tracksNeedsReview: 0,
      tracksFailed: 0,
      progress: 100,
      status: 'published',
      updatedAtLabel: '1 day ago',
    },
    {
      id: '46d66c66-a562-45e5-b350-6dcc755dff1b',
      label: 'Numb',
      sourceType: 'youtube_track',
      sourceLabel: 'YouTube track',
      tracksTotal: 1,
      tracksReady: 1,
      tracksNeedsReview: 0,
      tracksFailed: 0,
      progress: 100,
      status: 'published',
      updatedAtLabel: '3 days ago',
    },
    {
      id: '4060fdf0-a49b-4906-a4c8-bb718d775dbb',
      label: 'Archive Import',
      sourceType: 's3_bucket',
      sourceLabel: 'S3 bucket',
      tracksTotal: 1280,
      tracksReady: 1210,
      tracksNeedsReview: 18,
      tracksFailed: 12,
      progress: 94,
      status: 'failed',
      updatedAtLabel: '11 min ago',
    },
  ])

  protected readonly todoImports = computed(() =>
    this.items().filter((item) => item.status !== 'published'),
  )

  protected readonly completedImports = computed(() =>
    this.items().filter((item) => item.status === 'published'),
  )

  protected readonly todoGroups = computed(() => this.groupBySource(this.todoImports()))
  protected readonly completedGroups = computed(() => this.groupBySource(this.completedImports()))

  protected createNew(): void {
    this.router.navigate(['/backstage/import/new'])
  }

  protected navigateToImport(importId: string): void {
    this.router.navigate(['/backstage/import', importId])
  }

  protected toggleItemSelection(importId: string): void {
    this.selectedItems.update((selectedItems) =>
      selectedItems.includes(importId)
        ? selectedItems.filter((selectedItemId) => selectedItemId !== importId)
        : [...selectedItems, importId],
    )
  }

  protected isSelected(importId: string): boolean {
    return this.selectedItems().includes(importId)
  }

  protected selectAll(tab: ImportTab): void {
    const imports = tab === 'todo' ? this.todoImports() : this.completedImports()
    this.selectedItems.set(imports.map((item) => item.id))
  }

  protected clearSelection(): void {
    this.selectedItems.set([])
  }

  protected statusLabel(status: ImportStatus): string {
    switch (status) {
      case 'queued':
        return 'Queued'
      case 'analyzing':
        return 'Analyzing'
      case 'needs_review':
        return 'Needs review'
      case 'ready':
        return 'Ready'
      case 'publishing':
        return 'Publishing'
      case 'published':
        return 'Published'
      case 'failed':
        return 'Failed'
    }
  }

  private groupBySource(items: ImportOverviewItem[]): ImportSourceGroup[] {
    const sourceGroups = new Map<string, ImportSourceGroup>()

    for (const item of items) {
      const sourceGroup = sourceGroups.get(item.sourceType)

      if (!sourceGroup) {
        sourceGroups.set(item.sourceType, {
          sourceType: item.sourceType,
          sourceLabel: item.sourceLabel,
          imports: [item],
        })
        continue
      }

      sourceGroup.imports.push(item)
    }

    return Array.from(sourceGroups.values())
  }
}
