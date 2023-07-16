import { Injectable } from '@angular/core'
import OnClickData = chrome.contextMenus.OnClickData
import CreateProperties = chrome.tabs.CreateProperties

import Tab = chrome.tabs.Tab
import UpdateProperties = chrome.tabs.UpdateProperties
import UpdateInfo = chrome.windows.UpdateInfo

/** Wrapper around Chrome API. */
@Injectable({
  providedIn: 'root',
})
export class ChromeApiService {
  async getTab(tabId: number): Promise<Tab> {
    return chrome.tabs.get(tabId)
  }

  async getTabs(): Promise<Tab[]> {
    return chrome.tabs.query({})
  }

  async createTab(createProperties: CreateProperties): Promise<Tab> {
    return chrome.tabs.create(createProperties)
  }

  async removeTab(tabId: number): Promise<void> {
    return chrome.tabs.remove(tabId)
  }

  async updateTab(tabId: number, updateProperties: UpdateProperties): Promise<Tab> {
    return chrome.tabs.update(tabId, updateProperties)
  }

  async getWindows(): Promise<chrome.windows.Window[]> {
    return chrome.windows.getAll()
  }

  async updateWindow(windowId: number, updateInfo: UpdateInfo): Promise<chrome.windows.Window> {
    return chrome.windows.update(windowId, updateInfo)
  }

  setBadgeText(text: string): Promise<void> {
    return chrome.action.setBadgeText({ text: text })
  }

  setBadgeBackgroundColor(color: string): Promise<void> {
    return chrome.action.setBadgeBackgroundColor({ color: color })
  }

  addContextMenusOnClickedListener(callback: (info: OnClickData, tab?: chrome.tabs.Tab) => void) {
    chrome.contextMenus.onClicked.addListener(callback)
  }
}
