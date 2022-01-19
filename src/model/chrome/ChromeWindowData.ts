import { injectable } from 'inversify'
import { WindowData } from '../WindowData'

@injectable()
class ChromeWindowData implements WindowData {
  async getAll(): Promise<chrome.windows.Window[]> {
    return chrome.windows.getAll()
  }
}

export { ChromeWindowData }
