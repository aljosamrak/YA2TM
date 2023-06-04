import Tab = chrome.tabs.Tab
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

  setTabs(urls: string[]) {
    this.tabs = urls.map((url) => this.createTab(url))
  }

  async getWindows(): Promise<Window[]> {
    return Promise.resolve(this.windows)
  }

  setWindows(num: number) {
    this.windows = [...Array(num).map(() => this.createWindow())]
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
