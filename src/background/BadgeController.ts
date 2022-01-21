interface BadgeController {
  updateTabCount(currentTabsPromise: Promise<chrome.tabs.Tab[]>): void
}

export { BadgeController }
