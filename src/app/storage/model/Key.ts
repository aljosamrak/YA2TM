import { UserPreferences } from '../../settings/model/user-preferences'

export type Key<T> = {
  key: string
  defaultValue: () => T
}

export const UUID_KEY: Key<string | undefined> = {
  key: 'ga',
  defaultValue: () => undefined,
}

export const USER_PREFERENCES: Key<UserPreferences> = {
  key: 'ga',
  defaultValue: () => new UserPreferences(),
}
