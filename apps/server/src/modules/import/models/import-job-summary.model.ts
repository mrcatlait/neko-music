import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ImportJobSummary {
  @Field(() => ID)
  id: string

  @Field(() => String)
  dataSource: string

  @Field(() => String)
  sourceRef: string

  @Field(() => String)
  label: string

  @Field(() => String)
  status: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date, { nullable: true })
  startedAt: Date | null

  @Field(() => Date, { nullable: true })
  completedAt: Date | null

  @Field(() => Int)
  totalItems: number

  @Field(() => Int)
  completedItems: number

  @Field(() => Int)
  failedItems: number

  @Field(() => Int)
  pendingReviewItems: number

  @Field(() => Int)
  progressPercent: number
}
