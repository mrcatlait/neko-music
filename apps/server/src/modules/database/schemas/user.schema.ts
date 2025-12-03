export interface ProfileTable {
  userId: string
  displayName: string
}

export interface EmailPreferencesField {
  marketing: boolean
  newReleases: boolean
  securityAlerts: boolean
  weeklyDigest: boolean
}

export interface PushPreferencesField {
  marketing: boolean
  newReleases: boolean
}

export interface PreferencesTable {
  userId: string
  emailPreferences: EmailPreferencesField
  pushPreferences: PushPreferencesField
}

export interface UserSchema {
  'user.Profile': ProfileTable
  'user.Preferences': PreferencesTable
}
