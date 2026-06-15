import { Injectable } from '@nestjs/common'
import { Args, ID, Query } from '@nestjs/graphql'
import { Permissions } from '@neko/permissions'

import { ImportMethod } from '../models/import-method.model'
import { ImportJobItemPromotionEligibilityInput } from '../models/import-job-item-promotion-eligibility.input'
import { ImportJobItemPromotionEligibility } from '../models/import-job-item-promotion-eligibility.model'
import { ImportJobItemClaim } from '../models/import-job-item-claim.model'
import { ImportJobDetails } from '../models/import-job-details.model'
import { ImportJobSummary } from '../models/import-job-summary.model'
import { GetImportJobItemClaimsUseCase } from '../use-cases/get-import-job-item-claims'
import { GetImportJobUseCase } from '../use-cases/get-import-job'
import { GetImportJobsUseCase } from '../use-cases/get-import-jobs'
import { GetImportMethodsUseCase } from '../use-cases/get-import-methods'
import { GetImportJobItemPromotionEligibilityUseCase } from '../use-cases/get-import-job-item-promotion-eligibility'
import { RequirePermissions } from '@/modules/auth/decorators'

@Injectable()
export class ImportQuery {
  constructor(
    private readonly getImportMethodsUseCase: GetImportMethodsUseCase,
    private readonly getImportJobItemPromotionEligibilityUseCase: GetImportJobItemPromotionEligibilityUseCase,
    private readonly getImportJobItemClaimsUseCase: GetImportJobItemClaimsUseCase,
    private readonly getImportJobsUseCase: GetImportJobsUseCase,
    private readonly getImportJobUseCase: GetImportJobUseCase,
  ) {}

  @Query(() => [ImportMethod])
  @RequirePermissions(Permissions.Import.Read)
  importMethods(): Promise<ImportMethod[]> {
    return this.getImportMethodsUseCase.invoke()
  }

  @Query(() => [ImportJobSummary])
  @RequirePermissions(Permissions.Import.Read)
  imports(): Promise<ImportJobSummary[]> {
    return this.getImportJobsUseCase.invoke()
  }

  @Query(() => ImportJobDetails)
  @RequirePermissions(Permissions.Import.Read)
  importJob(@Args('id', { type: () => ID }) id: string): Promise<ImportJobDetails> {
    return this.getImportJobUseCase.invoke({ id })
  }

  @Query(() => [ImportJobItemClaim])
  @RequirePermissions(Permissions.Import.Read)
  importJobItemClaims(@Args('importJobItemId', { type: () => ID }) importJobItemId: string): Promise<ImportJobItemClaim[]> {
    return this.getImportJobItemClaimsUseCase.invoke({
      importJobItemId,
    })
  }

  @Query(() => ImportJobItemPromotionEligibility)
  @RequirePermissions(Permissions.Import.Read)
  importJobItemPromotionEligibility(
    @Args('input') input: ImportJobItemPromotionEligibilityInput,
  ): Promise<ImportJobItemPromotionEligibility> {
    return this.getImportJobItemPromotionEligibilityUseCase.invoke({
      importJobItemId: input.importJobItemId,
    })
  }
}
