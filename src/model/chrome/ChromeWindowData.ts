import { Injectable } from '@angular/core'
import { WindowData } from '../WindowData'

@Injectable({
  providedIn: 'root',
})
export class ChromeWindowData implements WindowData {
  async getAll(): Promise<chrome.windows.Window[]> {
    return chrome.windows.getAll()
  }
}
