import {
  Controller,
  Headers,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { File, FileInterceptor } from '@nest-lab/fastify-multer'

import { UPLOAD_TOKEN_HEADER } from '../constants'
import { UploadTokenGuard } from '../guards'
import { UploadMediaUseCase } from '../use-cases'

import { UserSession } from '@/modules/auth/interfaces'
import { AuthGuard } from '@/modules/auth/guards'
import { Session } from '@/modules/auth/decorators'

const MAX_FILE_SIZE = 1024 * 1024 * 50 // 50MB for audio files

@Controller('media')
@ApiTags('Media')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private readonly uploadMediaUseCase: UploadMediaUseCase) {}

  @Post('/upload')
  @UseGuards(UploadTokenGuard)
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Session() session: UserSession,
    @Headers(UPLOAD_TOKEN_HEADER) token: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE })],
      }),
    )
    file: File,
  ): Promise<void> {
    return this.uploadMediaUseCase.invoke({ file, userId: session.userId, token })
  }
}
