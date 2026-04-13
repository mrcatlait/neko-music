import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UploadToken {
  @Field(() => String)
  uploadToken: string
}
