import { Injectable } from '@angular/core'

import { ChromeApiService } from '../../chrome/chrome-api.service'
import { ChromeNotificationService } from '../../chrome/chrome-notification'
import { DeduplicateStrategy, UserPreferences } from '../../settings/model/user-preferences'
import { SettingsService } from '../../settings/service/settings.service'
import { TrackedEvent } from '../../storage/model/EventRecord'
import { DatabaseService } from '../../storage/service/database.service'
import Tab = chrome.tabs.Tab

@Injectable({
  providedIn: 'root',
})
export class DeduplicationService {
  constructor(
    private chromeApiService: ChromeApiService,
    private chromeNotificationService: ChromeNotificationService,
    private databaseService: DatabaseService,
    private settingsService: SettingsService,
  ) {}

  static extractGreatSuspenderUrl(url: string) {
    // The Great Suspender encodes URLs when it suspends pages.
    const suspenderPrefix = 'chrome-extension://jaekigmcljkkalnicnjoafgfjoefkpeg/suspended.html#'
    if (url.startsWith(suspenderPrefix)) {
      return url.slice(url.lastIndexOf('uri=') + 4)
    } else {
      return url
    }
  }

  static formatUrl(url: string, preferences: UserPreferences): string {
    preferences.deduplicateStripUrlParts.split(',').forEach((stripUrl: string) => {
      url = url.replace(new RegExp(stripUrl.trim()), '')
    })

    return url
  }

  async deduplicate(tab: Tab) {
    const preferences = this.settingsService.getUserPreferences()

    // Feature disabled
    if (!preferences.deduplicateTabs) {
      return
    }

    // URL is empty at the beginning
    if (!tab.url) {
      return
    }

    // If we shouldn't deduplicate this URL
    if (
      preferences.deduplicateDontDeduplicateUrls
        .split(',')
        .map((it) => it.trim())
        .includes(tab.url)
    ) {
      return
    }

    // Prepare URL to be matched, by cleaning it up and sanitize it
    tab.url = DeduplicationService.formatUrl(tab.url, preferences)

    const allTabs = await this.chromeApiService.getTabs()
    const allWindows = await this.chromeApiService.getWindows()

    let deduplicatedTabs = 0
    for (const otherTab of allTabs) {
      if (!otherTab.url || !otherTab.id || !tab.url || !tab.id) {
        return
      }

      const otherTabUrl = DeduplicationService.formatUrl(otherTab.url, preferences)
      if (tab.id !== otherTab.id && tab.url === otherTabUrl && tab.incognito === otherTab.incognito && !tab.pinned) {
        switch (preferences.deduplicateStrategy) {
          case DeduplicateStrategy.REMOVE_NEW_TAB:
            this.removeAndSwitch(tab.id, otherTab.windowId, otherTab.id)
            break
          case DeduplicateStrategy.REMOVE_OLD_TAB:
            this.removeAndSwitch(otherTab.id, tab.windowId, tab.id)
            break
          case DeduplicateStrategy.NOTIFICATION:
            this.chromeNotificationService.create(
              {
                type: 'basic',
                iconUrl: 'assets/icon-128.png',
                /** Optional. Title of the notification (e.g. sender name for email). Required for notifications.create method. */
                title: 'Duplicate tab opened',
                /** Optional. Main notification content. Required for notifications.create method. */
                message: '',
              },
              (notificationId: string) => {},
            )
            break
        }

        deduplicatedTabs++
        const timeNow = Date.now()
        this.databaseService.insert_records({
          timestamp: timeNow,
          url: tab.url ? tab.url : '',
          event: TrackedEvent.TabDeduplicated,
          windows: allWindows.length,
          tabs: allTabs.length - deduplicatedTabs,
        })
        return
      }
    }
  }

  removeAndSwitch(removeTabId: number, switchWindowId: number, switchTabId: number) {
    this.chromeApiService.updateTab(switchTabId, { selected: true })
    this.chromeApiService.updateWindow(switchWindowId, { focused: true })
    this.chromeApiService.removeTab(removeTabId)
  }
}
