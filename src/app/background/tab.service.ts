import { Injectable } from '@angular/core'
import { NGXLogger } from 'ngx-logger'

import { AnalyticsService } from '../analytics/analytics.service'
import { ChromeApiService } from '../chrome/chrome-api.service'
import { DeduplicationService } from '../duplicates/service/deduplication.service'
import { SettingsService } from '../settings/service/settings.service'
import { TrackedEvent } from '../storage/model/EventRecord'
import { DatabaseService } from '../storage/service/database.service'
import { BadgeService } from './badge.service'

import WindowEventFilter = chrome.windows.WindowEventFilter
import Window = chrome.windows.Window
import TabChangeInfo = chrome.tabs.TabChangeInfo
import Tab = chrome.tabs.Tab

@Injectable({
  providedIn: 'root',
})
export class TabService {
  constructor(
    private logger: NGXLogger,
    private analytics: AnalyticsService,
    private badgeService: BadgeService,
    private chromeApiService: ChromeApiService,
    private databaseService: DatabaseService,
    private deduplicationService: DeduplicationService,
    private settingsService: SettingsService,
  ) {
    chrome.tabs.onCreated.addListener(this.tabCreated.bind(this))
    chrome.tabs.onUpdated.addListener(this.tabUpdated.bind(this))
    chrome.tabs.onRemoved.addListener(this.tabRemoved.bind(this))
    chrome.windows.onCreated.addListener(this.windowCreated.bind(this))
    chrome.windows.onRemoved.addListener(this.windowRemoved.bind(this))
    this.badgeService.updateTabCount()
  }

  private async tabCreated(tab: Tab) {
    const currentTabsPromise = this.chromeApiService.getTabs()

    this.saveEventToDatabase(TrackedEvent.TabOpened, currentTabsPromise, tab)
  }

  private async tabRemoved(tabId: number) {
    return this.saveEventToDatabase(
      TrackedEvent.TabClosed,
      this.chromeApiService.getTabs(),
    )
  }

  private async tabUpdated(tabId: number, changeInfo: TabChangeInfo, tab: Tab) {
    // URL field will be present on URL change. Skip if not present.
    if (!changeInfo.url) {
      return
    }

    return this.deduplicationService.deduplicate(tab)
  }

  private windowCreated(
    _window: Window,
    filter?: WindowEventFilter | undefined,
  ) {
    return this.saveEventToDatabase(
      TrackedEvent.WindowOpened,
      this.chromeApiService.getTabs(),
    )
  }

  private windowRemoved(windowId: number) {
    return this.saveEventToDatabase(
      TrackedEvent.WindowClosed,
      this.chromeApiService.getTabs(),
    )
  }

  private async saveEventToDatabase(
    event: TrackedEvent,
    currentTabsPromise: Promise<chrome.tabs.Tab[]>,
    tab?: chrome.tabs.Tab,
  ) {
    this.badgeService.updateTabCount()

    // Query opened tabs and windows
    const timeNow = Date.now()

    const [windows, tabs] = await Promise.all([
      chrome.windows.getAll(),
      chrome.tabs.query({}),
    ])

    chrome.action.setBadgeText({ text: tabs.length.toString() })

    this.databaseService.insert_records({
      timestamp: timeNow,
      url: tab === undefined ? '' : tab.url!,
      event: event,
      windows: windows.length,
      tabs: tabs.length,
    })
  }
}
