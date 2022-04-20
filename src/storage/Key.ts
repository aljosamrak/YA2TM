import { Key } from './LocalStorage'

export enum BadgeTextType {
  ALL_TABS,
  ALL_WINDOW
}

export interface UserPreferences {
  badgeEnabled: boolean
  badgeTextType: BadgeTextType
  changingColorEnabled: boolean
  desiredTabs: number
}

export const ENABLE_CHANGING_BADGE: Key<boolean> = {
  key: 'changing-badge',
  defaultValue: true,
}

export const DESIRED_TABS: Key<number> = {
  key: 'desired-tabs',
  defaultValue: 20,
}

export const USER_PREFERENCES: Key<UserPreferences> = {
  key: 'user-preferences',
  defaultValue: {
    badgeEnabled: true,
    badgeTextType: BadgeTextType.ALL_TABS,
    changingColorEnabled: true,
    desiredTabs: 20,
  },
}
