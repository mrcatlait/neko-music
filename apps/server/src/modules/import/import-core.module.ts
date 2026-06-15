import { Module } from '@nestjs/common'

import { IMPORT_MODULE_OPTIONS } from './tokens'
import { CoreModuleWithOptions } from '../shared/classes'
import { TriggerImportRunnerCron } from './crons'
import {
  ImportDiscoveryItemRepository,
  ImportDiscoveryRepository,
  ImportJobItemRepository,
  ImportJobRepository,
  ImportJobItemRetryHistoryRepository,
  MetadataClaimMatchRepository,
  MetadataClaimRepository,
  MetadataClaimReviewRepository,
  MetadataClaimReviewHistoryRepository,
} from './repositories'
import { ImportMutation } from './mutations'
import { ImportQuery } from './queries'
import {
  ImportJobItemRunnerService,
  ImportRunnerService,
  MetadataClaimMatchService,
  MetadataClaimProcessorService,
  ImportJobRunnerService,
} from './services'
import {
  CancelImportJobUseCase,
  DiscoverImportUseCase,
  GetImportJobItemPromotionEligibilityUseCase,
  GetImportJobItemClaimsUseCase,
  GetImportJobUseCase,
  GetImportJobsUseCase,
  GetImportMethodsUseCase,
  ImportUseCase,
  ImportValidator,
  PromoteImportJobItemUseCase,
  RetryImportJobItemUseCase,
  RefreshImportDiscoveryUseCase,
  ReviewMetadataClaimUseCase,
  StartImportFromDiscoveryUseCase,
} from './use-cases'
import { ImportStrategyFactory } from './strategies'

@Module({})
export class ImportCoreModule extends CoreModuleWithOptions {
  static readonly module = ImportCoreModule
  static readonly optionsToken = IMPORT_MODULE_OPTIONS
  static readonly providers = [
    // Mutations
    ImportMutation,
    ImportQuery,
    TriggerImportRunnerCron,

    // Repositories
    ImportDiscoveryRepository,
    ImportDiscoveryItemRepository,
    ImportJobRepository,
    ImportJobItemRepository,
    ImportJobItemRetryHistoryRepository,
    MetadataClaimRepository,
    MetadataClaimMatchRepository,
    MetadataClaimReviewRepository,
    MetadataClaimReviewHistoryRepository,

    // Services
    ImportRunnerService,
    ImportJobRunnerService,
    ImportJobItemRunnerService,
    MetadataClaimMatchService,
    MetadataClaimProcessorService,

    // Use Cases
    DiscoverImportUseCase,
    GetImportMethodsUseCase,
    GetImportJobsUseCase,
    GetImportJobUseCase,
    GetImportJobItemClaimsUseCase,
    GetImportJobItemPromotionEligibilityUseCase,
    StartImportFromDiscoveryUseCase,
    RefreshImportDiscoveryUseCase,
    CancelImportJobUseCase,
    ReviewMetadataClaimUseCase,
    PromoteImportJobItemUseCase,
    RetryImportJobItemUseCase,
    ImportUseCase,
    ImportValidator,

    // Strategies
    ImportStrategyFactory,
  ]
  static readonly exports = []
}
