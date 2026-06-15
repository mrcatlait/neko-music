import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'

import { ConfigureImportStep, ReviewStep, SelectSourceStep } from './components'

import { Breadcrumb, BreadcrumbItem, StepIndicator } from '@/shared/components'
import { DiscoverImportGql, RefreshImportDiscoveryGql, StartImportFromDiscoveryGql } from '@/shared/generated-types'

// https://lollypop.design/blog/2026/january/wizard-ui-design/
// https://www.eleken.co/blog-posts/wizard-ui-pattern-explained
// https://www.andrewcoyle.com/blog/how-to-design-a-form-wizard

// https://dribbble.com/shots/24431454-Class-Wizard
// https://dribbble.com/shots/17257905-Campaign-Wizard-UI-Concept-for-Rocketfuel
// https://dribbble.com/shots/24908938-Debit-Credit-card-wizard-builder
// https://dribbble.com/shots/14228265-Add-a-venue-wizard-Summary-step

// https://dribbble.com/shots/25391096-Onboarding-steps-Untitled-UI
// https://dribbble.com/shots/21352282-Startup-Onboarding-Product-Design
@Component({
  selector: 'n-import-wizard',
  templateUrl: './import-wizard.html',
  styleUrl: './import-wizard.scss',
  imports: [Breadcrumb, BreadcrumbItem, RouterLink, StepIndicator, SelectSourceStep, ConfigureImportStep, ReviewStep],
  providers: [DiscoverImportGql, RefreshImportDiscoveryGql, StartImportFromDiscoveryGql],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportWizard {
  private readonly router = inject(Router)
  private readonly discoverImportGql = inject(DiscoverImportGql)
  private readonly refreshImportDiscoveryGql = inject(RefreshImportDiscoveryGql)
  private readonly startImportFromDiscoveryGql = inject(StartImportFromDiscoveryGql)

  protected readonly steps = ['Choose source', 'Configure import', 'Review']

  protected readonly selectedSource = signal<string>('')
  protected readonly sourceRef = signal<string>('')
  protected readonly discoveryId = signal<string>('')
  protected readonly discoveryTracks = signal<
    {
      id: string
      sourceItemRef: string
      label: string
      position: number
      isSelected: boolean
    }[]
  >([])
  protected readonly newSourceItemRefs = signal<string[]>([])
  protected readonly removedSourceItemRefs = signal<string[]>([])
  protected readonly isRefreshingDiscovery = signal<boolean>(false)
  protected readonly currentStep = signal<number>(0)

  protected selectSource(source: string) {
    this.selectedSource.set(source)
    this.currentStep.set(1)
  }

  protected backToSelectSource() {
    this.currentStep.set(0)
  }

  protected backToConfigureImport() {
    this.currentStep.set(1)
  }

  protected async configureImport(config: { dataSource: string; sourceRef: string }) {
    const result = await this.discoverImportGql.mutate({
      input: {
        dataSource: config.dataSource,
        sourceRef: config.sourceRef,
      },
    })

    if (!result.data) {
      return
    }

    this.sourceRef.set(config.sourceRef)
    this.discoveryId.set(result.data.discoverImport.id)
    this.discoveryTracks.set(result.data.discoverImport.tracks)
    this.newSourceItemRefs.set([])
    this.removedSourceItemRefs.set([])
    this.currentStep.set(2)
  }

  protected async refreshDiscovery() {
    const discoveryId = this.discoveryId()

    if (!discoveryId || this.isRefreshingDiscovery()) {
      return
    }

    this.isRefreshingDiscovery.set(true)

    try {
      const result = await this.refreshImportDiscoveryGql.mutate({
        input: {
          discoveryId,
        },
      })

      if (!result.data) {
        return
      }

      this.discoveryId.set(result.data.refreshImportDiscovery.discovery.id)
      this.discoveryTracks.set(result.data.refreshImportDiscovery.discovery.tracks)
      this.newSourceItemRefs.set(result.data.refreshImportDiscovery.newSourceItemRefs)
      this.removedSourceItemRefs.set(result.data.refreshImportDiscovery.removedSourceItemRefs)
    } finally {
      this.isRefreshingDiscovery.set(false)
    }
  }

  protected async startImport(payload: { selectedItemIds: string[] }) {
    const discoveryId = this.discoveryId()

    if (!discoveryId) {
      return
    }

    const result = await this.startImportFromDiscoveryGql.mutate({
      input: {
        discoveryId,
        selectedItemIds: payload.selectedItemIds,
      },
    })

    if (!result.data?.startImportFromDiscovery) {
      return
    }

    void this.router.navigate(['/backstage/import', result.data.startImportFromDiscovery])
  }
}

// Step-by-step progression: the core of wizard UI lies in its stepwise structure. Each stage of the process is showed individually, with clear navigation to move forward or backward.

// Progress indicators: wizards typically use progress indicators, such as numbered steps or a progress bar, to show users where they are in the process. This reassures users and builds confidence as they complete each step.

// User-friendly navigation: buttons like “Next,” “Back,” or “Finish” are essential in wizard UIs, allowing users to control their pace and revisit previous steps if needed.

// Error handling: clear feedback on errors (such as missing information) at each step is vital to reduce frustration and guide users toward a successful completion.
