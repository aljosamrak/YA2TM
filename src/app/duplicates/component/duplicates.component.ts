import { Component, OnInit } from '@angular/core'

import { ChromeApiService } from '../../chrome/chrome-api.service'
import { DeduplicationService } from '../service/deduplication.service'
import { SettingsService } from '../../settings/service/settings.service'
import Tab = chrome.tabs.Tab

@Component({
  selector: 'duplicates',
  templateUrl: './duplicates.component.html',
  styleUrls: ['./duplicates.component.sass'],
})
export class DuplicatesComponent implements OnInit {
  duplicates: Tab[] = []

  constructor(
    private chromeApiService: ChromeApiService,
    private settingsService: SettingsService,
  ) {}

  async ngOnInit(): Promise<void> {
    const preferences = this.settingsService.getUserPreferences()

    const allTabs = await this.chromeApiService.getTabs()

    const urlCounts = allTabs.reduce((urlMap, tab) => {
      const url = DeduplicationService.formatUrl(tab.url!, preferences)
      const tabs = urlMap.get(url)
      if (tabs === undefined) {
        urlMap.set(url, [tab])
      } else {
        tabs.push(tab)
      }
      return urlMap
    }, new Map<string, Array<Tab>>())

    const duplicateTabs = new Array<Tab>()
    urlCounts.forEach(tabs => {
      if (tabs.length > 1) {
        tabs.forEach(tab => duplicateTabs.push(tab))
      }
    })

    this.duplicates = duplicateTabs
  }
}
