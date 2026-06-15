import { Args, Mutation } from '@nestjs/graphql'
import { Injectable } from '@nestjs/common'
import { Permissions } from '@neko/permissions'

import {
  DiscoverImportInput,
  ImportDiscovery,
  ImportDiscoveryRefreshResult,
  ImportInput,
  CancelImportJobInput,
  ReviewMetadataClaimInput,
  PromoteImportJobItemInput,
  RetryImportJobItemInput,
  RefreshImportDiscoveryInput,
  StartImportFromDiscoveryInput,
} from '../models'
import {
  DiscoverImportUseCase,
  ImportUseCase,
  CancelImportJobUseCase,
  ReviewMetadataClaimUseCase,
  PromoteImportJobItemUseCase,
  RetryImportJobItemUseCase,
  RefreshImportDiscoveryUseCase,
  StartImportFromDiscoveryUseCase,
} from '../use-cases'

import { RequirePermissions, UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'

@Injectable()
export class ImportMutation {
  constructor(
    private readonly importUseCase: ImportUseCase,
    private readonly cancelImportJobUseCase: CancelImportJobUseCase,
    private readonly reviewMetadataClaimUseCase: ReviewMetadataClaimUseCase,
    private readonly promoteImportJobItemUseCase: PromoteImportJobItemUseCase,
    private readonly retryImportJobItemUseCase: RetryImportJobItemUseCase,
    private readonly discoverImportUseCase: DiscoverImportUseCase,
    private readonly startImportFromDiscoveryUseCase: StartImportFromDiscoveryUseCase,
    private readonly refreshImportDiscoveryUseCase: RefreshImportDiscoveryUseCase,
  ) {}

  @Mutation(() => ImportDiscovery)
  @RequirePermissions(Permissions.Import.Write)
  discoverImport(@Args('input') input: DiscoverImportInput, @UserSession() user: User): Promise<ImportDiscovery> {
    return this.discoverImportUseCase.invoke({
      dataSource: input.dataSource,
      sourceRef: input.sourceRef,
      userId: user.id,
    })
  }

  @Mutation(() => ImportDiscoveryRefreshResult)
  @RequirePermissions(Permissions.Import.Write)
  refreshImportDiscovery(
    @Args('input') input: RefreshImportDiscoveryInput,
    @UserSession() user: User,
  ): Promise<ImportDiscoveryRefreshResult> {
    return this.refreshImportDiscoveryUseCase.invoke({
      discoveryId: input.discoveryId,
      userId: user.id,
    })
  }

  @Mutation(() => String)
  @RequirePermissions(Permissions.Import.Write)
  startImportFromDiscovery(
    @Args('input') input: StartImportFromDiscoveryInput,
    @UserSession() user: User,
  ): Promise<string> {
    return this.startImportFromDiscoveryUseCase
      .invoke({
        discoveryId: input.discoveryId,
        selectedItemIds: input.selectedItemIds,
        userId: user.id,
      })
      .then((result) => result.id)
  }

  @Mutation(() => String)
  @RequirePermissions(Permissions.Import.Manage)
  cancelImportJob(@Args('input') input: CancelImportJobInput): Promise<string> {
    return this.cancelImportJobUseCase
      .invoke({
        jobId: input.jobId,
      })
      .then((result) => result.id)
  }

  @Mutation(() => String)
  @RequirePermissions(Permissions.Import.Write)
  import(@Args('input') input: ImportInput, @UserSession() user: User): Promise<string> {
    return this.importUseCase
      .invoke({
        dataSource: input.dataSource,
        sourceRef: input.sourceRef,
        userId: user.id,
      })
      .then((result) => result.id)
  }

  @Mutation(() => String)
  @RequirePermissions(Permissions.Import.Review)
  reviewMetadataClaim(@Args('input') input: ReviewMetadataClaimInput, @UserSession() user: User): Promise<string> {
    return this.reviewMetadataClaimUseCase
      .invoke({
        metadataClaimId: input.metadataClaimId,
        decision: input.decision,
        reviewedBy: user.id,
        replacementEntityId: input.replacementEntityId,
        replacementValue: input.replacementValue,
        reason: input.reason,
      })
      .then((result) => result.id)
  }

  @Mutation(() => String)
  @RequirePermissions(Permissions.Import.Promote)
  promoteImportJobItem(@Args('input') input: PromoteImportJobItemInput, @UserSession() user: User): Promise<string> {
    return this.promoteImportJobItemUseCase
      .invoke({
        importJobItemId: input.importJobItemId,
        userId: user.id,
      })
      .then((result) => result.id)
  }

  @Mutation(() => String)
  @RequirePermissions(Permissions.Import.Retry)
  retryImportJobItem(@Args('input') input: RetryImportJobItemInput, @UserSession() user: User): Promise<string> {
    return this.retryImportJobItemUseCase
      .invoke({
        importJobItemId: input.importJobItemId,
        reason: input.reason,
        userId: user.id,
      })
      .then((result) => result.id)
  }
}
