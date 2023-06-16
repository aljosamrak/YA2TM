import Tab = chrome.tabs.Tab
import UpdateProperties = chrome.tabs.UpdateProperties
import UpdateInfo = chrome.windows.UpdateInfo
import Window = chrome.windows.Window

export class ChromeApiStub {
  private nextTabId = 1
  private nextWindowId = 1

  private badgeText = ''
  private badgeBackgroundColor = ''
  private tabs: Tab[] = []
  private windows: Window[] = []

  async getTabs(): Promise<Tab[]> {
    return Promise.resolve(this.tabs)
  }

  getTabsUrls() {
    return this.tabs.map((url) => url.url)
  }

  setTabs(...tabs: Tab[]) {
    this.tabs = tabs
  }

  setTabUrls(...urls: string[]) {
    this.tabs = urls.map((url) => this.createTab(url))
  }

  updateTab(tabId: number, updateProperties: UpdateProperties) {
    // noop
  }

  removeTab(tabId: number) {
    this.tabs = this.tabs.filter((tab) => tab.id !== tabId)
  }

  async getWindows(): Promise<Window[]> {
    return Promise.resolve(this.windows)
  }

  setWindows(num: number) {
    this.windows = [...Array(num).map(() => this.createWindow())]
  }

  updateWindow(windowId: number, updateInfo: UpdateInfo) {
    // noop
  }

  getBadgeText() {
    return this.badgeText
  }

  setBadgeText(text: string) {
    this.badgeText = text
  }

  getBadgeBackgroundColor() {
    return this.badgeBackgroundColor
  }

  setBadgeBackgroundColor(text: string) {
    this.badgeBackgroundColor = text
  }

  createTab(url: string): Tab {
    return {
      id: this.nextTabId++,
      index: 1,
      url: url,
      pinned: false,
      highlighted: false,
      windowId: 1,
      active: true,
      incognito: false,
      selected: false,
      discarded: false,
      autoDiscardable: false,
      groupId: -1,
    }
  }

  createWindow(): Window {
    return {
      id: this.nextWindowId++,
      focused: false,
      alwaysOnTop: false,
      incognito: false,
    }
  }
}
