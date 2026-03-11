import { Role, Roles } from './roles'
import { getAllPermissions, Permissions } from './permissions'

export const RolePermissions: Record<Role, string[]> = {
  [Roles.Administrator]: getAllPermissions(),
  [Roles.User]: [Permissions.Track.Read, Permissions.Track.Write, Permissions.Track.Download],
}
