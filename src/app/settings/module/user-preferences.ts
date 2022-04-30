export class UserPreferences {
  badgeEnabled = true
  badgeSettings = new BadgeSettings()

  favoriteColor = ''

  experimentsEnabled = false
  experiments = new Experiments()
}

export class BadgeSettings {
  badgeTextType = BadgeTextType.TABS_NUM
  changingColorEnabled = true
}

export enum BadgeTextType {
  TABS_NUM,
  DAY_DIFF,
  WINDOW_NUM,
  DEDUPLICATED_TABS,
  // TODO do the same for tab color
}

export class Experiments {
  tabsEnabled = false
  drillDownEnabled = false
  deduplicateTabs = false
  achievementsEnabled = false
  desiredTabs = 30
}
