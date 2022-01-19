import { Database } from '../storage/Database'
import { container } from '../inversify/inversify.config'
import Tab = chrome.tabs.Tab
import Window = chrome.windows.Window
import WindowEventFilter = chrome.windows.WindowEventFilter
import { Logger } from '../services/Logger'
import { BadgeController } from './BadgeController'
import { TYPES } from '../inversify/types'

const logger: Logger = container.get(TYPES.Logger)
const database = container.get<Database>(TYPES.DatabaseService)
const badgeController = container.get<BadgeController>(TYPES.BadgeController)

async function setupListeners() {
  // Remove listeners
  chrome.tabs.onCreated.removeListener(tabAdded)
  chrome.tabs.onRemoved.removeListener(tabRemoved)
  chrome.tabs.onReplaced.removeListener(tabRemoved)
  chrome.tabs.onDetached.removeListener(tabRemoved)
  chrome.tabs.onAttached.removeListener(tabRemoved)
  chrome.tabs.onMoved.removeListener(tabRemoved)
  chrome.windows.onCreated.removeListener(windowCreated)
  chrome.windows.onRemoved.removeListener(windowRemoved)

  // Add listeners
  chrome.tabs.onCreated.addListener(tabAdded)
  chrome.tabs.onUpdated.addListener(tabRemoved)
  chrome.tabs.onRemoved.addListener(tabRemoved)
  chrome.tabs.onReplaced.addListener(tabRemoved)
  chrome.tabs.onDetached.addListener(tabRemoved)
  chrome.tabs.onAttached.addListener(tabRemoved)
  chrome.tabs.onMoved.addListener(tabRemoved)
  chrome.windows.onCreated.addListener(windowCreated)
  chrome.windows.onRemoved.addListener(windowRemoved)
  badgeController.updateTabCount()
}

async function tabAdded(tab: Tab) {
  saveEventToDatabase('opened', tab)
}

async function tabRemoved(tabId: number) {
  saveEventToDatabase('closed', undefined)
}

function windowCreated(window: Window, filter?: WindowEventFilter | undefined) {
  saveEventToDatabase('window-opened', undefined)
}

function windowRemoved(windowId: number) {
  saveEventToDatabase('window-opened', undefined)
}

async function saveEventToDatabase(operation: string, tab?: chrome.tabs.Tab) {
  badgeController.updateTabCount()

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

setupListeners()
