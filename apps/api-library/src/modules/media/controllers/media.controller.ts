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
import { CommandBus } from '@nestjs/cqrs'

import { UserSession } from '@modules/authentication/interfaces'
import { AuthGuard } from '@modules/authentication/guards'
import { Session } from '@modules/authentication/decorators'
import { UploadMediaCommand } from '@modules/media/commands'

const MAX_FILE_SIZE = 1024 * 1024 * 5 // 5MB

@Controller('media')
@ApiTags('Media')
@ApiCookieAuth()
@UseGuards(AuthGuard)
export class MediaController {
  constructor(private readonly commandBus: CommandBus) {}

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
    return this.commandBus.execute(new UploadMediaCommand(file, session.userId, token))
  }
}
