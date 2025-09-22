import { Controller } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

@Controller('backstage/releases')
@ApiTags('Backstage Releases')
@ApiBearerAuth()
export class ReleaseController {}
