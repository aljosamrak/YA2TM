import { Injectable } from '@angular/core'

import { ChromeApiService } from '../chrome/chrome-api.service'
import { SettingsService } from '../settings/service/settings.service'
import { TrackedEvent } from '../storage/model/EventRecord'
import { DatabaseService } from '../storage/service/database.service'

import Tab = chrome.tabs.Tab

@Injectable({
  providedIn: 'root',
})
export class DeduplicationService {
  constructor(
    private chromeApiService: ChromeApiService,
    private databaseService: DatabaseService,
    private settingsService: SettingsService,
  ) {}

  static extractGreatSuspenderUrl(url: string) {
    // The Great Suspender encodes URLs when it suspends pages.
    const suspenderPrefix =
      'chrome-extension://jaekigmcljkkalnicnjoafgfjoefkpeg/suspended.html#'
    if (url.startsWith(suspenderPrefix)) {
      return url.slice(url.lastIndexOf('uri=') + 4)
    } else {
      return url
    }
  }

  static extractUrl(url: string): string {
    return this.extractGreatSuspenderUrl(url)
  }

  async deduplicate(tab: Tab) {
    if (!this.settingsService.getUserPreferences().deduplicateTabs) {
      return
    }

    // URL is empty at the beginning
    if (!tab.url) {
      return
    }

    // If disabled, don't deduplicate new tab
    if (
      !this.settingsService.getUserPreferences().deduplicateNewTab &&
      tab.url === 'chrome://newtab/'
    ) {
      return
    }

    const allTabs = await this.chromeApiService.getTabs()
    const allWindows = await this.chromeApiService.getWindows()

    let deduplicatedTabs = 0
    for (const otherTab of allTabs) {
      if (!otherTab.url || !otherTab.id || !tab.url || !tab.id) {
        return
      }

      const otherTabUrl = DeduplicationService.extractUrl(otherTab.url)
      if (
        tab.id !== otherTab.id &&
        tab.url === otherTabUrl &&
        tab.incognito === otherTab.incognito &&
        !tab.pinned
      ) {
        this.chromeApiService.updateTab(otherTab.id, { selected: true })
        this.chromeApiService.updateWindow(otherTab.windowId, { focused: true })
        this.chromeApiService.removeTab(tab.id)

        deduplicatedTabs++
        const timeNow = Date.now()
        this.databaseService.insert_records({
          timestamp: timeNow,
          url: tab.url ? tab.url : '',
          event: TrackedEvent.TabDeduplicated,
          windows: allWindows.length,
          tabs: allTabs.length - deduplicatedTabs,
        })
      }
    }
  }
}
