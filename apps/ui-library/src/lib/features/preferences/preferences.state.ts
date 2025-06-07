type Theme = 'light' | 'dark'

export class UserPreferencesState {
  // Audio settings
  volume = $state<number>(50)
  muted = $state<boolean>(false)

  // Playback settings
  autoplay = $state<boolean>(true)

  // UI settings
  theme = $state<Theme>('light')
  language = $state<string>('en')
}
