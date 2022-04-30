export class UserPreferences {
  badgeEnabled = true
  badgeSettings = new BadgeSettings()

  favoriteColor = ''
  desiredTabs = 30

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
  deduplicateTabs = false
  achievementsEnabled = false
  tabsEnabled = false
}
