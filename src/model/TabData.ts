import Tab = chrome.tabs.Tab
import UpdateProperties = chrome.tabs.UpdateProperties

interface TabData {
  query(): Promise<Tab[]>

  remove(id: number): Promise<void>

  update(tabId: number, updateProperties: UpdateProperties): Promise<Tab>
}

export { TabData }
