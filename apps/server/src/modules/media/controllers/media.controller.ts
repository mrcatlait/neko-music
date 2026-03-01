import {
  Controller,
  Headers,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { File, FileInterceptor } from '@nest-lab/fastify-multer'

import { UploadMediaUseCase } from '../use-cases'
import { UPLOAD_TOKEN_HEADER_NAME } from '../constants'
import { UploadMediaDto } from '../dtos'

const DEFAULT_MAX_FILE_SIZE = 1024 * 1024 * 50 // 50MB

@Controller('media')
@ApiTags('Media')
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly uploadMediaUseCase: UploadMediaUseCase) {}

  @Post('/upload')
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
  @ApiResponse({
    status: 201,
    description: 'The media has been successfully uploaded',
    type: UploadMediaDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadMedia(
    @Headers(UPLOAD_TOKEN_HEADER_NAME) token: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: DEFAULT_MAX_FILE_SIZE })],
      }),
    )
    file: File,
  ): Promise<UploadMediaDto> {
    return this.uploadMediaUseCase.invoke({ file, token })
  }
}
