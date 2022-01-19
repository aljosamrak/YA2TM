interface WindowData {
  getAll(): Promise<chrome.windows.Window[]>
}

export { WindowData }
