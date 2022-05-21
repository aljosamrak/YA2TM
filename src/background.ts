import { DatePipe } from '@angular/common'
import { HttpBackend, HttpEvent, HttpRequest } from '@angular/common/http'
import { Injector } from '@angular/core'
import {
  NGXLogger,
  NGXLoggerConfigEngineFactory,
  NGXLoggerMapperService,
  NGXLoggerMetadataService,
  NGXLoggerRulesService,
  NGXLoggerServerService,
  NGXLoggerWriterService,
} from 'ngx-logger'
import { Observable } from 'rxjs'
import {
  AnalyticsIdConfig,
  AnalyticsService,
} from './app/analytics/analytics.service'
import { SettingsService } from './app/settings/service/settings.service'
import { LocalstorageService } from './app/storage/service/localstorage.service'
import { BadgeController } from './controller/BadgeController'
import { TabController } from './controller/tab/TabController'
import { GOOGLE_ANALYTICS_TRACKING_ID } from './environments/environment-generated'
import { ChromeTabData } from './model/chrome/ChromeTabData'
import { ChromeWindowData } from './model/chrome/ChromeWindowData'
import { IndexedDBDatabase } from './model/indexeddb/IndexedDBDatabase'
import { ChromeBadgeView } from './view/chrome/ChromeBadgeView'

const httpBackend = new (class MyRunnable extends HttpBackend {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return new Observable((subscriber) => {
      subscriber.complete()
    })
  }
})()

const logger = new NGXLogger(
  { level: 0, serverLogLevel: 0, disableConsoleLogging: false },
  new NGXLoggerConfigEngineFactory(),
  new NGXLoggerMetadataService(new DatePipe('', undefined)),
  new NGXLoggerRulesService(),
  new NGXLoggerMapperService(httpBackend),
  new NGXLoggerWriterService(''),
  new NGXLoggerServerService(httpBackend),
)

const analyticsConfiguration: AnalyticsIdConfig = {
  id: GOOGLE_ANALYTICS_TRACKING_ID,
}

const options = {
  providers: [
    { provide: NGXLogger, useValue: logger },
    { provide: LocalstorageService, deps: [] },

    {
      provide: AnalyticsIdConfig,
      useValue: analyticsConfiguration,
    },
    {
      provide: AnalyticsService,
      deps: [AnalyticsIdConfig, LocalstorageService],
    },

    { provide: IndexedDBDatabase, deps: [NGXLogger, AnalyticsService] },

    { provide: SettingsService, deps: [LocalstorageService] },

    // Models
    { provide: ChromeTabData, deps: [] },
    { provide: ChromeWindowData, deps: [] },

    // Views
    { provide: ChromeBadgeView, deps: [] },

    // Controllers
    {
      provide: BadgeController,
      deps: [SettingsService, ChromeTabData, ChromeWindowData, ChromeBadgeView],
    },
    {
      provide: TabController,
      deps: [
        NGXLogger,
        AnalyticsService,
        SettingsService,
        ChromeTabData,
        ChromeWindowData,
        IndexedDBDatabase,
        BadgeController,
      ],
    },
  ],
}

const injector = Injector.create(options)
const tabController = injector.get(TabController)
