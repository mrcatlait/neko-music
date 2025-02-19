import { Injectable } from '@nestjs/common'

import { Saga } from '@modules/shared/saga/saga'

export interface UploadMediaSagaContext {
  token: string
  file: File
  userId: string
  entityId?: string
  entityType?: string
}

@Injectable()
export class UploadMediaSaga extends Saga {}
