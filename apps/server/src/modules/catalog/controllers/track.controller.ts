import { Controller } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@Controller('catalog/tracks')
@ApiTags('Tracks')
@ApiBearerAuth()
export class TrackController {
  constructor() {}
}
