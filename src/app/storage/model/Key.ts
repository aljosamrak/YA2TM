import { UserPreferences } from '../../settings/model/user-preferences'

export type Key<T> = {
  key: string
  defaultValue: () => T
  isStringType: boolean
}

export const UUID_KEY: Key<string | undefined> = {
  key: 'ga',
  defaultValue: () => undefined,
  isStringType: true,
}

export const USER_PREFERENCES: Key<UserPreferences> = {
  key: 'preferences',
  defaultValue: () => new UserPreferences(),
  isStringType: false,
}
