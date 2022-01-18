import Tab = chrome.tabs.Tab

interface TabData {
  query(): Promise<Tab[]>
}

export { TabData }
