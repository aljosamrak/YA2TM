import { isEqual } from 'lodash'

export enum BadgeTextType {
  ALL_TABS_NUM,
  // THIS_WINDOW_TABS_NUM,
  // DAY_DIFF,
  WINDOW_NUM, // DEDUPLICATED_TABS,
  // TODO implement all possibilities
}

// TODO do the same for tab color

export enum DeduplicateStrategy {
  REMOVE_NEW_TAB,
  REMOVE_OLD_TAB,
  NOTIFICATION,
}

export class UserPreferences {
  badgeEnabled = true
  badgeTextType = BadgeTextType.ALL_TABS_NUM
  // TODO add options for badge color
  changingColorEnabled = true

  decimationNumPoints = 20

  favoriteColor = ''

  experimentsEnabled = false
  tabsEnabled = false
  drillDownEnabled = false

  // Tab deduplication settings
  deduplicateTabs = false
  deduplicateStrategy = DeduplicateStrategy.REMOVE_NEW_TAB
  deduplicateIgnoreHashPart = true
  deduplicateIgnoreSearchPart = true
  deduplicateIgnorePathPart = false
  deduplicateIgnore3w = false
  deduplicateIgnoreCase = false
  deduplicateCompareWithTitle = true
  deduplicateSearchInAllWindows = true
  deduplicateDontDeduplicateUrls = 'chrome://newtab/'
  deduplicateStripUrlParts = 'chrome-extension:\\/\\/jaekigmcljkkalnicnjoafgfjoefkpeg\\/suspended\\.html#.*uri='

  snoozingEnabled = false

  achievementsEnabled = false
  desiredTabs = 30

  static equals(a: UserPreferences, b: UserPreferences) {
    return isEqual(a, b)
  }
}
