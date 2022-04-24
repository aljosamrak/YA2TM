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
  NgGoogleAnalyticsTracker,
} from './app/analytics/ng-google-analytics.service'
import { SettingsService } from './app/settings/service/settings.service'
import { BadgeController } from './controller/BadgeController'
import { TabController } from './controller/tab/TabController'
import { GOOGLE_ANALYTICS_TRACKING_ID } from './environments/environment-generated'
import { ChromeTabData } from './model/chrome/ChromeTabData'
import { ChromeWindowData } from './model/chrome/ChromeWindowData'
import { IndexedDBDatabase } from './model/indexeddb/IndexedDBDatabase'
import { LocalStorageImpl } from './storage/LocalStorageImpl'
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

const options = {
  providers: [
    { provide: NGXLogger, useValue: logger },

    {
      provide: AnalyticsIdConfig,
      useValue: {
        id: GOOGLE_ANALYTICS_TRACKING_ID,
        scriptPath: 'analytics/analytics.js',
      },
    },
    { provide: NgGoogleAnalyticsTracker, deps: [AnalyticsIdConfig] },

    { provide: LocalStorageImpl, deps: [] },
    { provide: IndexedDBDatabase, deps: [NGXLogger, NgGoogleAnalyticsTracker] },

    { provide: SettingsService, deps: [LocalStorageImpl] },

    // Models
    { provide: ChromeTabData, deps: [] },
    { provide: ChromeWindowData, deps: [] },

    // Views
    { provide: ChromeBadgeView, deps: [] },

    // Controllers
    {
      provide: BadgeController,
      deps: [
        ChromeTabData,
        ChromeWindowData,
        LocalStorageImpl,
        ChromeBadgeView,
      ],
    },
    {
      provide: TabController,
      deps: [
        NGXLogger,
        NgGoogleAnalyticsTracker,
        SettingsService,
        ChromeTabData,
        ChromeWindowData,
        LocalStorageImpl,
        IndexedDBDatabase,
        BadgeController,
      ],
    },
  ],
}

const injector = Injector.create(options)
const tabController = injector.get(TabController)
