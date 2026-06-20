import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { AgGridAngular } from 'ag-grid-angular'
import { AllCommunityModule, ColDef, GridOptions } from 'ag-grid-community'

import { ImportSourceChip, ImportStatusCellRenderer } from '../shared'
import { GRID_OPTIONS, provideGridOptions } from '../../shared/providers'

import { Breadcrumb, BreadcrumbItem, Button, IconButton } from '@/shared/components'
import { Menu, MenuItem, MenuTrigger } from '@/shared/menu'
import {
  CancelImportJobGql,
  GetImportJobGql,
  GetImportJobQuery,
  GetImportJobItemClaimsGql,
  GetImportJobItemClaimsQuery,
  GetImportJobItemPromotionEligibilityGql,
  PromoteImportJobItemGql,
  RetryImportJobItemGql,
  ReviewMetadataClaimGql,
} from '@/shared/generated-types'
import { TimeAgoPipe } from '@/shared/pipes'

type ImportJobItem = GetImportJobQuery['importJob']['items'][number]
type ImportJobItemClaim = GetImportJobItemClaimsQuery['importJobItemClaims'][number]

@Component({
  selector: 'n-import-details',
  templateUrl: './import-details.html',
  styleUrl: './import-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AgGridAngular,
    ImportSourceChip,
    Button,
    Breadcrumb,
    BreadcrumbItem,
    RouterLink,
    IconButton,
    Menu,
    MenuItem,
    MenuTrigger,
    TimeAgoPipe,
  ],
  providers: [
    provideGridOptions(),
    GetImportJobGql,
    GetImportJobItemClaimsGql,
    CancelImportJobGql,
    GetImportJobItemPromotionEligibilityGql,
    PromoteImportJobItemGql,
    RetryImportJobItemGql,
    ReviewMetadataClaimGql,
  ],
})
export class ImportDetails {
  private readonly route = inject(ActivatedRoute)
  private readonly defaultGridOptions = inject(GRID_OPTIONS)
  private readonly getImportJobGql = inject(GetImportJobGql)
  private readonly getImportJobItemClaimsGql = inject(GetImportJobItemClaimsGql)
  private readonly cancelImportJobGql = inject(CancelImportJobGql)
  private readonly getImportJobItemPromotionEligibilityGql = inject(GetImportJobItemPromotionEligibilityGql)
  private readonly promoteImportJobItemGql = inject(PromoteImportJobItemGql)
  private readonly retryImportJobItemGql = inject(RetryImportJobItemGql)
  private readonly reviewMetadataClaimGql = inject(ReviewMetadataClaimGql)
  private readonly importId = this.route.snapshot.paramMap.get('importId') ?? ''

  protected menuOpen = false
  protected readonly importJobResource = this.getImportJobGql.graphqlResource({
    id: this.importId,
  })
  protected readonly importJob = computed(() => this.importJobResource.value()?.importJob ?? null)
  protected readonly importItems = computed(() => this.importJob()?.items ?? [])
  protected readonly selectedImportJobItemId = signal('')
  protected readonly selectedImportJobItem = computed(
    () => this.importItems().find((item) => item.id === this.selectedImportJobItemId()) ?? null,
  )
  protected readonly itemClaims = signal<ImportJobItemClaim[]>([])
  protected readonly itemClaimsError = signal('')
  protected readonly isLoadingClaims = signal(false)
  protected readonly claimDecisionDraft = signal<Record<string, string>>({})
  protected readonly claimReplacementEntityIdDraft = signal<Record<string, string>>({})
  protected readonly claimReplacementValueDraft = signal<Record<string, string>>({})
  protected readonly savingClaimId = signal<string | null>(null)
  protected readonly isCheckingEligibility = signal(false)
  protected readonly eligibility = signal<{ isEligible: boolean; unresolvedRequiredFields: string[] } | null>(null)
  protected readonly eligibilityError = signal('')
  protected readonly reviewStatusMessage = signal('')
  protected readonly reviewError = signal('')
  protected readonly isPromotingItem = signal(false)
  protected readonly promoteStatusMessage = signal('')
  protected readonly promoteError = signal('')
  protected readonly retryReason = signal('')
  protected readonly isRetryingItem = signal(false)
  protected readonly retryStatusMessage = signal('')
  protected readonly retryError = signal('')
  protected readonly isCancelingImport = signal(false)
  protected readonly cancelStatusMessage = signal('')
  protected readonly cancelError = signal('')

  protected readonly modules = [AllCommunityModule]
  protected readonly reviewDecisions = [
    { value: 'pending', label: 'Pending' },
    { value: 'link_existing', label: 'Link existing' },
    { value: 'create_new', label: 'Create new' },
    { value: 'ignore', label: 'Ignore' },
    { value: 'reject', label: 'Reject' },
  ]

  protected readonly gridOptions: GridOptions = {
    ...this.defaultGridOptions,
  }

  protected readonly itemColumnDefs: ColDef<ImportJobItem>[] = [
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      cellRenderer: ImportStatusCellRenderer,
    },
    {
      field: 'label',
      headerName: 'Item',
      minWidth: 320,
      flex: 3,
      tooltipField: 'label',
    },
    {
      field: 'sourceItemRef',
      headerName: 'Source ref',
      minWidth: 180,
      flex: 1,
      tooltipField: 'sourceItemRef',
      cellStyle: {
        color: 'var(--color-text-medium-emphasis)',
      },
    },
    {
      headerName: 'Action',
      minWidth: 150,
      maxWidth: 180,

      valueGetter: ({ data }) => {
        if (!data) {
          return ''
        }

        if (data.status === 'completed' && data.errorMessage === 'hard_duplicate') {
          return 'Duplicate skipped'
        }

        switch (data.status) {
          case 'failed':
            return 'Retry'
          case 'in_progress':
            return 'Live logs'
          case 'pending':
            return 'Review'
          default:
            return 'View details'
        }
      },
    },
    {
      field: 'retryCount',
      headerName: 'Retries',
      minWidth: 110,
      maxWidth: 130,
      cellStyle: {
        color: 'var(--color-text-medium-emphasis)',
      },
    },
  ]

  constructor() {
    effect(() => {
      const firstItemId = this.importItems()[0]?.id

      if (firstItemId && !this.selectedImportJobItemId()) {
        this.selectedImportJobItemId.set(firstItemId)
      }
    })

    effect(() => {
      const importJobItemId = this.selectedImportJobItemId()

      if (!importJobItemId) {
        this.itemClaims.set([])
        return
      }

      void this.loadClaims(importJobItemId)
    })
  }

  protected onSelectedItemChange(event: Event): void {
    this.selectedImportJobItemId.set(this.getEventValue(event))
  }

  protected onClaimDecisionChange(claimId: string, event: Event): void {
    this.claimDecisionDraft.update((draft) => ({
      ...draft,
      [claimId]: this.getEventValue(event),
    }))
  }

  protected onClaimReplacementEntityIdChange(claimId: string, event: Event): void {
    this.claimReplacementEntityIdDraft.update((draft) => ({
      ...draft,
      [claimId]: this.getEventValue(event),
    }))
  }

  protected onClaimReplacementValueChange(claimId: string, event: Event): void {
    this.claimReplacementValueDraft.update((draft) => ({
      ...draft,
      [claimId]: this.getEventValue(event),
    }))
  }

  protected onRetryReasonChange(event: Event): void {
    this.retryReason.set(this.getEventValue(event))
  }

  protected async checkPromotionEligibility(): Promise<void> {
    const importJobItemId = this.selectedImportJobItemId()

    if (!importJobItemId || this.isCheckingEligibility()) {
      return
    }

    this.isCheckingEligibility.set(true)
    this.eligibilityError.set('')

    try {
      const result = await this.getImportJobItemPromotionEligibilityGql.fetch({
        input: {
          importJobItemId,
        },
      })

      if (result.error) {
        this.eligibilityError.set('Could not load promotion eligibility. Retry in a moment.')
        return
      }

      if (!result.data) {
        this.eligibilityError.set('No eligibility data returned for this item.')
        return
      }

      this.eligibility.set({
        isEligible: result.data.importJobItemPromotionEligibility.isEligible,
        unresolvedRequiredFields: result.data.importJobItemPromotionEligibility.unresolvedRequiredFields,
      })
    } finally {
      this.isCheckingEligibility.set(false)
    }
  }

  protected async submitReviewAction(claimId: string): Promise<void> {
    const claim = this.itemClaims().find((itemClaim) => itemClaim.id === claimId)

    if (!claim || this.savingClaimId()) {
      return
    }

    const decision = this.getClaimDecision(claim)
    const replacementEntityId = this.getClaimReplacementEntityId(claim)
    const replacementValue = this.getClaimReplacementValue(claim)

    this.savingClaimId.set(claimId)
    this.reviewError.set('')
    this.reviewStatusMessage.set('')

    try {
      const result = await this.reviewMetadataClaimGql.mutate({
        input: {
          metadataClaimId: claimId,
          decision,
          replacementEntityId: replacementEntityId || undefined,
          replacementValue: replacementValue || undefined,
        },
      })

      if (result.error) {
        this.reviewError.set('Could not submit claim review. Check fields and retry.')
        return
      }

      this.reviewStatusMessage.set('Claim review saved.')
      await this.loadClaims(claim.importJobItemId)
      await this.checkPromotionEligibility()
    } finally {
      this.savingClaimId.set(null)
    }
  }

  protected async cancelImport(): Promise<void> {
    const jobId = this.importJob()?.id

    if (this.isCancelingImport() || !jobId) {
      return
    }

    this.isCancelingImport.set(true)
    this.cancelError.set('')
    this.cancelStatusMessage.set('')

    try {
      const result = await this.cancelImportJobGql.mutate({
        input: {
          jobId,
        },
      })

      if (result.error) {
        this.cancelError.set('Could not request cancellation. Retry in a moment.')
        return
      }

      this.cancelStatusMessage.set('Cancel requested. New items will stop scheduling.')
    } finally {
      this.isCancelingImport.set(false)
    }
  }

  protected async promoteSelectedItem(): Promise<void> {
    const importJobItemId = this.selectedImportJobItemId()

    if (!importJobItemId || this.isPromotingItem()) {
      return
    }

    this.isPromotingItem.set(true)
    this.promoteError.set('')
    this.promoteStatusMessage.set('')

    try {
      const result = await this.promoteImportJobItemGql.mutate({
        input: {
          importJobItemId,
        },
      })

      if (result.error) {
        this.promoteError.set('Could not promote this item. Resolve claims and retry.')
        return
      }

      this.promoteStatusMessage.set('Promotion started. Draft and media handoff completed.')
      await this.checkPromotionEligibility()
    } finally {
      this.isPromotingItem.set(false)
    }
  }

  protected async retrySelectedItem(): Promise<void> {
    const selectedItem = this.selectedImportJobItem()

    if (!selectedItem || this.isRetryingItem()) {
      return
    }

    if (selectedItem.status !== 'failed') {
      this.retryError.set('Only failed items can be retried.')
      return
    }

    this.isRetryingItem.set(true)
    this.retryError.set('')
    this.retryStatusMessage.set('')

    try {
      const result = await this.retryImportJobItemGql.mutate({
        input: {
          importJobItemId: selectedItem.id,
          reason: this.retryReason().trim() || undefined,
        },
      })

      if (result.error) {
        this.retryError.set('Could not request retry. Try again in a moment.')
        return
      }

      this.retryStatusMessage.set('Retry requested. Item is queued again.')
      this.retryReason.set('')
    } finally {
      this.isRetryingItem.set(false)
    }
  }

  private getEventValue(event: Event): string {
    const target = event.target as HTMLInputElement | HTMLSelectElement | null
    return target?.value ?? ''
  }

  protected getClaimDecision(claim: ImportJobItemClaim): string {
    return this.claimDecisionDraft()[claim.id] ?? claim.decision
  }

  protected getClaimReplacementEntityId(claim: ImportJobItemClaim): string {
    return this.claimReplacementEntityIdDraft()[claim.id] ?? claim.replacementEntityId ?? ''
  }

  protected getClaimReplacementValue(claim: ImportJobItemClaim): string {
    return this.claimReplacementValueDraft()[claim.id] ?? claim.replacementValue ?? ''
  }

  private async loadClaims(importJobItemId: string): Promise<void> {
    this.isLoadingClaims.set(true)
    this.itemClaimsError.set('')

    try {
      const result = await this.getImportJobItemClaimsGql.fetch({
        importJobItemId,
      })

      if (result.error) {
        this.itemClaimsError.set('Could not load claims for this item.')
        this.itemClaims.set([])
        return
      }

      this.itemClaims.set(result.data?.importJobItemClaims ?? [])
    } finally {
      this.isLoadingClaims.set(false)
    }
  }
}
