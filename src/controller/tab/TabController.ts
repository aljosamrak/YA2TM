import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import { LocalStorage } from '../../storage/LocalStorage'
import { TYPES } from '../../inversify/types'
import { TabData } from '../../model/TabData'
import { WindowData } from '../../model/WindowData'
import { BadgeController } from '../../background/BadgeController'
import { TrackedEvent } from '../../model/TrackedEvent'
import Tab = chrome.tabs.Tab
import WindowEventFilter = chrome.windows.WindowEventFilter
import Window = chrome.windows.Window
import { Database } from '../../storage/Database'

@injectable()
class TabController {

  constructor(
    @inject(TYPES.TabData) private tabData: TabData,
    @inject(TYPES.WindowData) private windowData: WindowData,
    @inject(TYPES.LocalStorageService) private localStorage: LocalStorage,
    @inject(TYPES.DatabaseService) private database: Database,
    @inject(TYPES.BadgeController) private badgeController: BadgeController
  ) { }

  async setupListeners() {
    // Remove listeners
    chrome.tabs.onCreated.removeListener(this.tabAdded)
    chrome.tabs.onRemoved.removeListener(this.tabRemoved)
    chrome.tabs.onReplaced.removeListener(this.tabRemoved)
    chrome.tabs.onDetached.removeListener(this.tabRemoved)
    chrome.tabs.onAttached.removeListener(this.tabRemoved)
    chrome.tabs.onMoved.removeListener(this.tabRemoved)
    chrome.windows.onCreated.removeListener(this.windowCreated)
    chrome.windows.onRemoved.removeListener(this.windowRemoved)

    // Add listeners
    chrome.tabs.onCreated.addListener(this.tabAdded)
    chrome.tabs.onRemoved.addListener(this.tabRemoved)
    chrome.tabs.onReplaced.addListener(this.tabRemoved)
    chrome.tabs.onDetached.addListener(this.tabRemoved)
    chrome.tabs.onAttached.addListener(this.tabRemoved)
    chrome.tabs.onMoved.addListener(this.tabRemoved)
    chrome.windows.onCreated.addListener(this.windowCreated)
    chrome.windows.onRemoved.addListener(this.windowRemoved)
    this.badgeController.updateTabCount()
  }

  async tabAdded(tab: Tab) {
    return this.saveEventToDatabase(TrackedEvent.TabOpened, tab)
  }

  async tabRemoved(tabId: number) {
    return this.saveEventToDatabase(TrackedEvent.TabClosed, undefined)
  }

  windowCreated(window: Window, filter?: WindowEventFilter | undefined) {
    return this.saveEventToDatabase(TrackedEvent.WindowOpened, undefined)
  }

  windowRemoved(windowId: number) {
    return this.saveEventToDatabase(TrackedEvent.WindowClosed, undefined)
  }

  async saveEventToDatabase(event: TrackedEvent, tab?: chrome.tabs.Tab) {
    this.badgeController.updateTabCount()
    // Query opened tabs and windows
    const timeNow = Date.now()

    const [windows, tabs] = await Promise.all([chrome.windows.getAll(), chrome.tabs.query({})])

    chrome.action.setBadgeText({ text: tabs.length.toString() })

    this.database.insert_records({
      timestamp: timeNow,
      url: tab === undefined ? '' : tab.url!,
      event: event,
      windows: windows.length,
      tabs: tabs.length,
    })
  }
}

export { TabController }
