import { insert_records } from '../database/Database'

chrome.tabs.onCreated.addListener((tab) => {
  add('opened', tab)
})

chrome.tabs.onRemoved.addListener((tab) => {
  add('closed', undefined)
})

async function add(operation: string, tab?: chrome.tabs.Tab) {
  // Query opened tabs and windows
  const timeNow = Date.now()
  const windows = await chrome.windows.getAll()
  const tabs = await chrome.tabs.query({})

  chrome.action.setBadgeText({ text: tabs.length.toString() })

  insert_records({
    timestamp: timeNow,
    url: tab === undefined ? '' : tab.url!,
    status: operation,
    windows: windows.length,
    tabs: tabs.length,
  })
}

// Set tabs count on start
chrome.tabs.query({}).then((tabs) =>
  chrome.action.setBadgeText({ text: tabs.length.toString() }))
