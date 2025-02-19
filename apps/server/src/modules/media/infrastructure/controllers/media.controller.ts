import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiConsumes, ApiCookieAuth, ApiTags } from '@nestjs/swagger'
import { File, FileInterceptor } from '@nest-lab/fastify-multer'
import { Session } from '@modules/authentication/infrastructure/decorators'

import { UserSession } from '@modules/authentication/shared/interfaces'
import { AuthGuard } from '@modules/authentication/infrastructure/guards'
import { UploadMediaHandler } from '@modules/media/upload/commands/upload-media'

const MAX_FILE_SIZE = 1024 * 1024 * 5 // 5MB

@Controller('media')
@ApiTags('Media')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private readonly uploadMediaHandler: UploadMediaHandler) {}

  @Post('/upload/:token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  createArtist(
    @Session() session: UserSession,
    @Param('token') token: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: new RegExp('image/*') }),
        ],
      }),
    )
    file: File,
  ): Promise<void> {
    return this.uploadMediaHandler.handle({
      token,
      file,
      userId: session.userId,
    })
  }
}
