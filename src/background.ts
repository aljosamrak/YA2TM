import {TabController} from './controller/tab/TabController'
import {logger} from './services/Logger'
import {BadgeController} from './controller/BadgeController'
import {ExperimentsController} from './controller/ExperimentsController'
import {ChromeTabData} from './model/chrome/ChromeTabData'
import {ChromeWindowData} from './model/chrome/ChromeWindowData'
import {LocalStorageImpl} from './storage/LocalStorageImpl'
import {IndexedDBDatabase} from './model/indexeddb/IndexedDBDatabase'
import {GoogleAnalytics} from './analytics/GoogleAnalytics'
import {ChromeBadgeView} from './view/chrome/ChromeBadgeView'

// Create Tab controller
let analytics = new GoogleAnalytics()
let tabData = new ChromeTabData()
let windowData = new ChromeWindowData()
let storage = new LocalStorageImpl()

new TabController(
  logger,
  tabData,
  windowData,
  storage,
  new IndexedDBDatabase(analytics),
  new BadgeController(tabData, windowData, storage, new ChromeBadgeView()),
  analytics,
  new ExperimentsController(logger, analytics, storage),
)
