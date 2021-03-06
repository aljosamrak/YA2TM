export enum BadgeTextType {
  TABS_NUM,
  DAY_DIFF,
  WINDOW_NUM,
  DEDUPLICATED_TABS,
  // TODO do the same for tab color
}

export class UserPreferences {
  badgeEnabled = true
  badgeTextType = BadgeTextType.TABS_NUM
  changingColorEnabled = true

  favoriteColor = ''

  experimentsEnabled = false
  tabsEnabled = false
  drillDownEnabled = false

  // Tab deduplication settings
  deduplicateTabs = false
  deduplicateNewTab = true

  achievementsEnabled = false
  desiredTabs = 30
}
