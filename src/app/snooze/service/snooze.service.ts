import { Injectable } from '@angular/core'
import { NGXLogger } from 'ngx-logger'

import { ChromeAlarmApiService } from '../../chrome/chrome-alarm-api.service'
import { ChromeApiService } from '../../chrome/chrome-api.service'
import { SettingsService } from '../../settings/service/settings.service'
import { DatabaseService } from '../../storage/service/database.service'

import Tab = chrome.tabs.Tab
import Alarm = chrome.alarms.Alarm
import OnClickData = chrome.contextMenus.OnClickData

type ContextItem = {
  text: string
  func: (tab?: Tab) => void
}

@Injectable({
  providedIn: 'root',
})
export class SnoozeService {
  CONTEXT_ITEMS = new Map<string, ContextItem>([
    [
      'snooze_tab_15min',
      {
        text: '🕑 ⏰ Snooze tab for 15 min',
        func: (tab?: Tab) => this.snoozeTab(15, tab),
      },
    ],
    [
      'snooze_tab_30min',
      {
        text: '🕑 ⏰ Snooze tab for 30 min',
        func: (tab?: Tab) => this.snoozeTab(30, tab),
      },
    ],
    [
      'snooze_tab_60min',
      {
        text: '🕑 ⏰ Snooze tab for 60 min',
        func: (tab?: Tab) => this.snoozeTab(60, tab),
      },
    ],
  ])

  constructor(
    private chromeAlarmApiService: ChromeAlarmApiService,
    private chromeApiService: ChromeApiService,
    private databaseService: DatabaseService,
    private logger: NGXLogger,
    private settingsService: SettingsService,
  ) {
    settingsService.userPreferences$.subscribe(() => this.setUpContextMenus())
  }

  async createAlarm(delayInMinutes: number) {
    await this.chromeAlarmApiService.create('wakeUpTabs', {
      delayInMinutes: delayInMinutes,
    })
  }

  snoozeTab(delayMinutes: number, tab?: chrome.tabs.Tab) {
    if (!tab) {
      return
    }

    this.logger.debug(`snooZing ${delayMinutes}`)
    this.logger.debug(new Date().getTime() + delayMinutes * 60 * 1000)

    this.databaseService.addSnoozedTab({
      title: tab.title,
      url: tab.url,
      snoozedTimestamp: new Date().getTime(),
      unsnoozedTimestamp: new Date().getTime() + delayMinutes * 60 * 1000,
      windowId: tab.windowId,
      index: tab.index,
    })

    if (tab.id) {
      this.createAlarm(delayMinutes)
      this.chromeApiService.removeTab(tab.id)
    }
  }

  async onContextMenuClick(info: OnClickData, tab?: chrome.tabs.Tab) {
    console.log(info)
    console.log(tab)
    if (!this.CONTEXT_ITEMS.has(info.menuItemId.toString())) {
    }

    this.CONTEXT_ITEMS.get(info.menuItemId.toString())!.func(tab)
  }

  async setUpContextMenus() {
    if (!this.settingsService.getUserPreferences().snoozingEnabled) {
      return
    }

    await chrome.contextMenus.removeAll()
    await chrome.contextMenus.create({
      id: 'snooze_tab',
      contexts: ['all'],
      title: 'Snooze tab',
    })

    this.CONTEXT_ITEMS.forEach((value: ContextItem, key: string) => {
      chrome.contextMenus.create({
        parentId: 'snooze_tab',
        id: key,
        contexts: ['all'],
        title: value.text,
      })
    })

    this.chromeApiService.addContextMenusOnClickedListener(
      this.onContextMenuClick.bind(this),
    )

    this.chromeAlarmApiService.addListener(this.unsnoozeTab.bind(this))
  }

  private unsnoozeTab(alarm: Alarm) {
    console.log('unsnoozing')
    console.log(alarm)
    console.log('Alarm received')

    this.databaseService.snoozedTabs
      .where('unsnoozedTimestamp')
      .belowOrEqual(new Date().getTime())
      .each((snoozedTab, cursor) => {
        this.logger.debug(snoozedTab)
        this.chromeApiService.createTab({
          index: snoozedTab.index,
          url: snoozedTab.url,
          windowId: snoozedTab.windowId,
        })
        this.chromeApiService.updateWindow(snoozedTab.windowId, {
          focused: true,
        })
        this.databaseService.removeSnoozedTab(cursor.primaryKey)
      })
      .catch((err) => this.logger.error(err.message))
  }
}
