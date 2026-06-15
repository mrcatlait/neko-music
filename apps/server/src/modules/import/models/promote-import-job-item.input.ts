import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class PromoteImportJobItemInput {
  @Field(() => ID)
  importJobItemId: string
}
