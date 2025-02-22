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
import { CommandBus } from '@nestjs/cqrs'

import { UploadTokenGuard } from '../guards'
import { UPLOAD_TOKEN_HEADER } from '../constants'

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
  createArtist(
    @Session() session: UserSession,
    @Headers(UPLOAD_TOKEN_HEADER) token: string,
    @UploadedFile() file: File,
  ): Promise<void> {
    return this.commandBus.execute(new UploadMediaCommand(file, session.userId, token))
  }
}
