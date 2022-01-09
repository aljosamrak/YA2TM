import { Database } from '../storage/Database'
import { container } from '../inversify/inversify.config'
import SERVICE_IDENTIFIER from '../inversify/identifiers'
import Tab = chrome.tabs.Tab
import TabActiveInfo = chrome.tabs.TabActiveInfo
import Window = chrome.windows.Window
import WindowEventFilter = chrome.windows.WindowEventFilter
import { Logger } from '../services/Logger'

const database = container.get<Database>(SERVICE_IDENTIFIER.DatabaseService)
const logger: Logger = container.get(SERVICE_IDENTIFIER.Logger)

let activeTabs: TabActiveInfo[] = []

async function setupListeners() {
  // Remove listeners
  chrome.tabs.onCreated.removeListener(tabAdded)
  chrome.tabs.onRemoved.removeListener(tabRemoved)
  chrome.tabs.onReplaced.removeListener(tabRemoved)
  chrome.tabs.onDetached.removeListener(tabRemoved)
  chrome.tabs.onAttached.removeListener(tabRemoved)
  chrome.tabs.onActivated.removeListener(tabActiveChanged)
  chrome.tabs.onMoved.removeListener(tabRemoved)
  chrome.windows.onFocusChanged.removeListener(windowFocus)
  chrome.windows.onCreated.removeListener(windowCreated)
  chrome.windows.onRemoved.removeListener(windowRemoved)

  // Add listeners
  chrome.tabs.onCreated.addListener(tabAdded)
  chrome.tabs.onUpdated.addListener(tabRemoved)
  chrome.tabs.onRemoved.addListener(tabRemoved)
  chrome.tabs.onReplaced.addListener(tabRemoved)
  chrome.tabs.onDetached.addListener(tabRemoved)
  chrome.tabs.onAttached.addListener(tabRemoved)
  chrome.tabs.onActivated.addListener(tabActiveChanged)
  chrome.tabs.onMoved.addListener(tabRemoved)
  chrome.windows.onFocusChanged.addListener(windowFocus)
  chrome.windows.onCreated.addListener(windowCreated)
  chrome.windows.onRemoved.addListener(windowRemoved)
  updateTabCount()
}

async function tabAdded(tab: Tab) {
  add('opened', tab)
  updateTabCount()
}

async function tabRemoved(tabId: number) {
  add('closed', undefined)
}

function tabActiveChanged(tab: TabActiveInfo) {
  if (!!tab && !!tab.tabId) {
    let i
    if (!activeTabs) {
      activeTabs = []
    }
    if (!!activeTabs && activeTabs.length > 0) {
      const lastActive = activeTabs[activeTabs.length - 1]
      if (!!lastActive && lastActive.tabId === tab.tabId && lastActive.windowId === tab.windowId) {
        return
      }
    }
    while (activeTabs.length > 20) {
      activeTabs.shift()
    }
    for (i = activeTabs.length - 1; i >= 0; i--) {
      if (activeTabs[i].tabId === tab.tabId) {
        activeTabs.splice(i, 1)
      }
    }
    activeTabs.push(tab)
  }
  updateTabCount()
}

function windowFocus(windowId: number) {
  try {
    if (!!windowId) {
      windowActive(windowId)
      hideWindows(windowId)
    }
  } catch (e) {
    logger.error(e)
  }
}

function windowCreated(window: Window, filter?: WindowEventFilter | undefined) {
  try {
    if (!!window && !!window.id) {
      windowActive(window.id)
    }
  } catch (e) {
    logger.error(e)
  }
}

function windowRemoved(windowId: number) {
  try {
    if (!!windowId) {
      windowActive(windowId)
    }
  } catch (e) {
    logger.error(e)
  }
}

async function hideWindows(windowId: number) {
  if (navigator.userAgent.search('Firefox') > -1) {
    return
  }

  if (!windowId || windowId < 0) {
    return
  } else {
    if (localStorageAvailable()) {
      if (typeof localStorage.hideWindows === 'undefined') {
        localStorage.hideWindows = '0'
      }
      if (localStorage.hideWindows === '0') {
        return
      }
    } else {
      logger.warning('no local storage')
      return
    }
  }
}

function windowActive(windowId: number) {
  if (windowId < 0) {
    return
  }
  let windows = JSON.parse(localStorage.windowAge)
  if (!(windows instanceof Array)) {
    windows = []
  }
  if (windows.indexOf(windowId) > -1) {
    windows.splice(windows.indexOf(windowId), 1)
  }
  windows.unshift(windowId)
  localStorage.windowAge = JSON.stringify(windows)
}

async function add(operation: string, tab?: chrome.tabs.Tab) {
  // Query opened tabs and windows
  const timeNow = Date.now()
  const [windows, tabs] = await Promise.all([chrome.windows.getAll(), chrome.tabs.query({})])

  chrome.action.setBadgeText({ text: tabs.length.toString() })

  database.insert_records({
    timestamp: timeNow,
    url: tab === undefined ? '' : tab.url!,
    status: operation,
    windows: windows.length,
    tabs: tabs.length,
  })
}

async function updateTabCount() {
  let run = true
  if (localStorageAvailable()) {
    if (typeof localStorage.badge === 'undefined') {
      localStorage.badge = '1'
    }
    if (localStorage.badge === '0') {
      run = false
    }
  }

  if (run) {
    // Set tabs count on start
    chrome.tabs.query({}).then((tabs) => {
        chrome.action.setBadgeText({ text: tabs.length.toString() })
      },
    )
  } else {
    await chrome.action.setBadgeText({ text: '' })
  }
}

function localStorageAvailable() {
  const test = 'test'
  try {
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

setupListeners()
