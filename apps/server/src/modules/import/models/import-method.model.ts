import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ImportMethod {
  @Field(() => String)
  key: string

  @Field(() => String)
  name: string

  @Field(() => String)
  description: string
}
