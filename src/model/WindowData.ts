import UpdateInfo = chrome.windows.UpdateInfo

interface WindowData {
  getAll(): Promise<chrome.windows.Window[]>

  update(
    windowId: number,
    updateInfo: UpdateInfo,
  ): Promise<chrome.windows.Window>
}

export { WindowData }
