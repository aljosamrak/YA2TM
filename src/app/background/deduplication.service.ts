import { Inject, Injectable } from '@angular/core'

import { TabData } from '../../model/TabData'
import { WindowData } from '../../model/WindowData'
import { SettingsService } from '../settings/service/settings.service'
import { TrackedEvent } from '../storage/model/EventRecord'
import { DatabaseService } from '../storage/service/database.service'

import Tab = chrome.tabs.Tab

@Injectable({
  providedIn: 'root',
})
export class DeduplicationService {
  constructor(
    private databaseService: DatabaseService,
    private settingsService: SettingsService,
    @Inject('TabData') private tabData: TabData,
    @Inject('WindowData') private windowData: WindowData,
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

    const allTabs = await this.tabData.query()
    const allWindows = await this.windowData.getAll()

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
        this.tabData.update(otherTab.id, { selected: true })
        this.windowData.update(otherTab.windowId, { focused: true })
        this.tabData.remove(tab.id)

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
