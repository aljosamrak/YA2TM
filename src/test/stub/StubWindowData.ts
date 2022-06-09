import { WindowData } from '../../model/WindowData'

class StubWindowData implements WindowData {
  private _windows: chrome.windows.Window[] = []

  getAll(): Promise<chrome.windows.Window[]> {
    return Promise.resolve(this._windows)
  }

  set(windows: chrome.windows.Window[]) {
    this._windows = windows
  }

  update(
    windowId: number,
    updateInfo: chrome.windows.UpdateInfo,
  ): Promise<chrome.windows.Window> {
    return Promise.resolve(this._windows[windowId])
  }
}

export { StubWindowData }
