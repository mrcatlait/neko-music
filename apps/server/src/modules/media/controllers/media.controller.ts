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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { File, FileInterceptor } from '@nest-lab/fastify-multer'

import { UPLOAD_TOKEN_HEADER } from '../constants'
import { UploadTokenGuard } from '../guards'
import { UploadMediaUseCase } from '../use-cases'

import { AuthGuard } from '@/modules/auth/guards'
import { UserSession } from '@/modules/auth/decorators'
import { User } from '@/modules/auth/interfaces'

const DEFAULT_MAX_FILE_SIZE = 1024 * 1024 * 50 // 50MB

@Controller('media')
@ApiTags('Media')
@ApiBearerAuth()
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
    @UserSession() user: User,
    @Headers(UPLOAD_TOKEN_HEADER) token: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: DEFAULT_MAX_FILE_SIZE })],
      }),
    )
    file: File,
  ): Promise<void> {
    return this.uploadMediaUseCase.invoke({ file, userId: user.id, token })
  }
}
