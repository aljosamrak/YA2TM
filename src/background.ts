import {GoogleAnalytics} from './analytics/GoogleAnalytics'
import {BadgeController} from './controller/BadgeController'
import {ExperimentsController} from './controller/ExperimentsController'
import {TabController} from './controller/tab/TabController'
import {ChromeTabData} from './model/chrome/ChromeTabData'
import {ChromeWindowData} from './model/chrome/ChromeWindowData'
import {IndexedDBDatabase} from './model/indexeddb/IndexedDBDatabase'
import {LocalStorageImpl} from './storage/LocalStorageImpl'
import {ChromeBadgeView} from './view/chrome/ChromeBadgeView'
import {DatePipe} from '@angular/common'
import {HttpBackend, HttpEvent, HttpRequest} from '@angular/common/http'
import {Injector} from '@angular/core'
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
import { GOOGLE_ANALYTICS_TRACKING_ID } from './environments/environment-generated'

const httpBackend = new (class MyRunnable extends HttpBackend {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return new Observable((subscriber) => {
      subscriber.complete()
    })
  }
})()

const logger = new NGXLogger(
  {level: 0, serverLogLevel: 0, disableConsoleLogging: false},
  new NGXLoggerConfigEngineFactory(),
  new NGXLoggerMetadataService(new DatePipe('', undefined)),
  new NGXLoggerRulesService(),
  new NGXLoggerMapperService(httpBackend),
  new NGXLoggerWriterService(''),
  new NGXLoggerServerService(httpBackend),
)

const options = {
  providers: [
    {provide: NGXLogger, useValue: logger},

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
    {
      provide: ExperimentsController,
      deps: [NGXLogger, NgGoogleAnalyticsTracker, LocalStorageImpl],
    },

    // Models
    {provide: ChromeTabData, deps: []},
    {provide: ChromeWindowData, deps: []},

    // Views
    {provide: ChromeBadgeView, deps: []},

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
        ChromeTabData,
        ChromeWindowData,
        LocalStorageImpl,
        IndexedDBDatabase,
        BadgeController,
        GoogleAnalytics,
        ExperimentsController,
      ],
    },
  ],
}

const injector = Injector.create(options)
const tabController = injector.get(TabController)
