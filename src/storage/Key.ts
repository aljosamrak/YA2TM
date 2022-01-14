import { Key } from "./LocalStorage"

interface UserPreferences {
  changingBadge: boolean
  desiredTabs: number
}

const ENABLE_CHANGING_BADGE: Key<boolean> = {
  key: "changing-badge",
  defaultValue: true,
}

const DESIRED_TABS: Key<number> = { key: "desired-tabs", defaultValue: 20 }

const USER_PREFERENCES: Key<UserPreferences> = {
  key: "user-preferences",
  defaultValue: {
    changingBadge: true,
    desiredTabs: 20
  },
}

export { UserPreferences, ENABLE_CHANGING_BADGE, DESIRED_TABS, USER_PREFERENCES }
