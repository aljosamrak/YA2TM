import { Injectable } from '@angular/core'

import { WindowData } from '../WindowData'

import UpdateInfo = chrome.windows.UpdateInfo

@Injectable({
  providedIn: 'root',
})
export class ChromeWindowData implements WindowData {
  async getAll(): Promise<chrome.windows.Window[]> {
    return chrome.windows.getAll()
  }

  async update(
    windowId: number,
    updateInfo: UpdateInfo,
  ): Promise<chrome.windows.Window> {
    return chrome.windows.update(windowId, updateInfo)
  }
}
