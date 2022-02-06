import 'reflect-metadata'
import {Container} from 'inversify'
import {Database} from '../model/Database'
import {IndexedDBDatabase} from '../model/indexeddb/IndexedDBDatabase'
import {Logger, logger} from '../services/Logger'
import {LocalStorageImpl} from '../storage/LocalStorageImpl'
import {LocalStorage} from '../storage/LocalStorage'
import {BadgeController} from '../controller/BadgeController'
import {TYPES} from './types'
import {ChromeBadgeView} from '../view/chrome/ChromeBadgeView'
import {BadgeView} from '../view/BadgeView'
import {TabData} from '../model/TabData'
import {ChromeTabData} from '../model/chrome/ChromeTabData'
import {WindowData} from '../model/WindowData'
import {ChromeWindowData} from '../model/chrome/ChromeWindowData'
import {TabController} from '../controller/tab/TabController'
import {Analytics} from '../analytics/Analytics'
import {GoogleAnalytics} from '../analytics/GoogleAnalytics'
const container = new Container()
container.bind<Logger>(TYPES.Logger).toConstantValue(logger)
container
  .bind<LocalStorage>(TYPES.LocalStorageService)
  .to(LocalStorageImpl)
  .inSingletonScope()
container
  .bind<Database>(TYPES.DatabaseService)
  .to(IndexedDBDatabase)
  .inSingletonScope()

// Models
container.bind<TabData>(TYPES.TabData).to(ChromeTabData).inSingletonScope()
container
  .bind<WindowData>(TYPES.WindowData)
  .to(ChromeWindowData)
  .inSingletonScope()

// Views
container
  .bind<BadgeView>(TYPES.BadgeView)
  .to(ChromeBadgeView)
  .inSingletonScope()

// Controllers
container
  .bind<BadgeController>(TYPES.BadgeController)
  .to(BadgeController)
  .inSingletonScope()
container
  .bind<TabController>(TYPES.TabController)
  .to(TabController)
  .inSingletonScope()
container
  .bind<Analytics>(TYPES.Analytics)
  .to(GoogleAnalytics)
  .inSingletonScope()

export {container}
