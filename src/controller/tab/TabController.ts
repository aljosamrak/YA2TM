import 'reflect-metadata'
import {LocalStorage} from '../../storage/LocalStorage'
import {TabData} from '../../model/TabData'
import {WindowData} from '../../model/WindowData'
import {BadgeController} from '../BadgeController'
import {TrackedEvent} from '../../model/TrackedEvent'
import {Database} from '../../model/Database'
import {Experiments} from '../../experiment/Experiments'
import Tab = chrome.tabs.Tab
import WindowEventFilter = chrome.windows.WindowEventFilter
import Window = chrome.windows.Window
import TabChangeInfo = chrome.tabs.TabChangeInfo
import {Analytics} from '../../analytics/Analytics'
import {Inject, Injectable} from '@angular/core'

@Injectable({
  providedIn: 'root',
})
class TabController {
  constructor(
    @Inject('TabData') private tabData: TabData,
    @Inject('WindowData') private windowData: WindowData,
    @Inject('LocalStorageService') private localStorage: LocalStorage,
    @Inject('DatabaseService') private database: Database,
    @Inject('BadgeController') private badgeController: BadgeController,
    @Inject('Analytics') private analytics: Analytics,
  ) {
    chrome.tabs.onCreated.addListener(this.tabCreated.bind(this))
    chrome.tabs.onUpdated.addListener(this.tabUpdated.bind(this))
    chrome.tabs.onRemoved.addListener(this.tabRemoved.bind(this))
    chrome.windows.onCreated.addListener(this.windowCreated.bind(this))
    chrome.windows.onRemoved.addListener(this.windowRemoved.bind(this))
    this.badgeController.updateTabCount(this.tabData.query())
  }

  private async tabCreated(tab: Tab) {
    const currentTabsPromise = this.tabData.query()

    this.saveEventToDatabase(TrackedEvent.TabOpened, currentTabsPromise, tab)
  }

  private async tabRemoved(tabId: number) {
    return this.saveEventToDatabase(
      TrackedEvent.TabClosed,
      this.tabData.query(),
    )
  }

  private async tabUpdated(tabId: number, changeInfo: TabChangeInfo, tab: Tab) {
    const currentTabsPromise = this.tabData.query()

    this.deduplicate(tab, currentTabsPromise)
  }

  private windowCreated(
    _window: Window,
    filter?: WindowEventFilter | undefined,
  ) {
    return this.saveEventToDatabase(
      TrackedEvent.WindowOpened,
      this.tabData.query(),
    )
  }

  private windowRemoved(windowId: number) {
    return this.saveEventToDatabase(
      TrackedEvent.WindowClosed,
      this.tabData.query(),
    )
  }

  private async saveEventToDatabase(
    event: TrackedEvent,
    currentTabsPromise: Promise<chrome.tabs.Tab[]>,
    tab?: chrome.tabs.Tab,
  ) {
    this.badgeController.updateTabCount(currentTabsPromise)

    // Query opened tabs and windows
    const timeNow = Date.now()

    const [windows, tabs] = await Promise.all([
      chrome.windows.getAll(),
      chrome.tabs.query({}),
    ])

    chrome.action.setBadgeText({text: tabs.length.toString()})

    this.database.insert_records({
      timestamp: timeNow,
      url: tab === undefined ? '' : tab.url!,
      event: event,
      windows: windows.length,
      tabs: tabs.length,
    })
  }

  private deduplicate(
    newTab: chrome.tabs.Tab,
    existingTabsPromise: Promise<chrome.tabs.Tab[]>,
  ) {
    if (!new Experiments().tabDeduplication) {
      return
    }

    if (newTab.id === undefined) {
      return
    }

    existingTabsPromise.then((existingTabs) => {
      if (existingTabs.includes(newTab)) {
        this.tabData.remove(newTab.id!)
      }
    })
  }
}

export {TabController}
