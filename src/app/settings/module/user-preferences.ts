export class UserPreferences {
  colorful = true
  favoriteColor = ''
  desiredTabs = 30
  experimentsEnabled = false
  experiments = new Experiments()
}

export class Experiments {
  deduplicateTabs = false
  achievementsEnabled = false
  tabsEnabled = false
}
