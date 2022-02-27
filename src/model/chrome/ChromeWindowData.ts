import {WindowData} from '../WindowData'
import {Injectable} from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ChromeWindowData implements WindowData {
  async getAll(): Promise<chrome.windows.Window[]> {
    return chrome.windows.getAll()
  }
}
