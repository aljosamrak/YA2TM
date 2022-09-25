export enum BadgeTextType {
  TABS_NUM,
  DAY_DIFF,
  WINDOW_NUM,
  DEDUPLICATED_TABS,
  // TODO do the same for tab color
}

export enum DeduplicateStrategy {
  REMOVE_NEW_TAB,
  REMOVE_OLD_TAB,
  NOTIFICATION,
}

export class UserPreferences {
  badgeEnabled = true
  badgeTextType = BadgeTextType.TABS_NUM
  changingColorEnabled = true

  decimationNumPoints = 20

  favoriteColor = ''

  experimentsEnabled = false
  tabsEnabled = false
  drillDownEnabled = false

  // Tab deduplication settings
  deduplicateTabs = false
  deduplicateStrategy = DeduplicateStrategy.REMOVE_NEW_TAB
  deduplicateNewTab = true

  snoozingEnabled = false

  achievementsEnabled = false
  desiredTabs = 30
}
