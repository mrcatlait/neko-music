import { AuthDtos } from './auth'
import { BackstageDtos } from './backstage'
import { ErrorDtos } from './error'
import { MediaDtos } from './media'
import { SharedDtos } from './shared'

export namespace Contracts {
  export import Auth = AuthDtos

  export import Backstage = BackstageDtos

  export import Error = ErrorDtos

  export import Media = MediaDtos

  export import Shared = SharedDtos
}
