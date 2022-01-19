import { Key } from './LocalStorage'

enum BadgeTextType {
  ALL_TABS,
  ALL_WINDOW
}

interface UserPreferences {
  badgeEnabled: boolean
  badgeTextType: BadgeTextType
  changingColorEnabled: boolean
  desiredTabs: number
}

const ENABLE_CHANGING_BADGE: Key<boolean> = {
  key: 'changing-badge',
  defaultValue: true,
}

const DESIRED_TABS: Key<number> = { key: 'desired-tabs', defaultValue: 20 }

const USER_PREFERENCES: Key<UserPreferences> = {
  key: 'user-preferences',
  defaultValue: {
    badgeEnabled: true,
    badgeTextType: BadgeTextType.ALL_TABS,
    changingColorEnabled: true,
    desiredTabs: 20
  },
}

export { UserPreferences, BadgeTextType, ENABLE_CHANGING_BADGE, DESIRED_TABS, USER_PREFERENCES }
