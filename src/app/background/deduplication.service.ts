import { Injectable } from '@angular/core'

import { ChromeApiService } from '../chrome-api.service'
import { SettingsService } from '../settings/service/settings.service'
import { TrackedEvent } from '../storage/model/EventRecord'
import { DatabaseService } from '../storage/service/database.service'

import Tab = chrome.tabs.Tab

@Injectable({
  providedIn: 'root',
})
export class DeduplicationService {
  constructor(
    private chromeSpiService: ChromeApiService,
    private databaseService: DatabaseService,
    private settingsService: SettingsService,
  ) {}

  extractGreatSuspenderUrl(url: string) {
    // The Great Suspender encodes URLs when it suspends pages.
    const suspenderPrefix =
      'chrome-extension://jaekigmcljkkalnicnjoafgfjoefkpeg/suspended.html#'
    if (url.startsWith(suspenderPrefix)) {
      return url.slice(url.lastIndexOf('uri=') + 4)
    } else {
      return url
    }
  }

  async deduplicate(tab: Tab) {
    if (!this.settingsService.getUserPreferences().deduplicateTabs) {
      return
    }

    // URL is empty at the beginning
    if (!tab.url) {
      return
    }

    const allTabs = await this.chromeSpiService.getTabs()
    const allWindows = await this.chromeSpiService.getWindows()

    let deduplicatedTabs = 0
    allTabs.forEach((otherTab) => {
      if (!otherTab.url || !otherTab.id || !tab.url || !tab.id) {
        return
      }

      const otherTabUrl = this.extractGreatSuspenderUrl(otherTab.url)
      if (
        tab.id !== otherTab.id &&
        tab.url === otherTabUrl &&
        tab.incognito === otherTab.incognito &&
        !tab.pinned &&
        (!tab.openerTabId || tab.openerTabId !== otherTab.id)
      ) {
        this.chromeSpiService.updateTab(otherTab.id, { selected: true })
        this.chromeSpiService.updateWindow(otherTab.windowId, { focused: true })
        this.chromeSpiService.removeTab(tab.id)

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
    })
  }
}
