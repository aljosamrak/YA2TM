import Tab = chrome.tabs.Tab

interface TabData {
  query(): Promise<Tab[]>

  remove(id: number): Promise<void>
}

export { TabData }
