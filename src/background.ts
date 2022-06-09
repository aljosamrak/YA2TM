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
import { DeduplicationService } from './app/background/deduplication.service'
import { SettingsService } from './app/settings/service/settings.service'
import { DatabaseService } from './app/storage/service/database.service'
import { LocalStorageService } from './app/storage/service/local-storage.service'
import { BadgeController } from './controller/BadgeController'
import { TabController } from './controller/tab/TabController'
import { GOOGLE_ANALYTICS_TRACKING_ID } from './environments/environment-generated'
import { ChromeTabData } from './model/chrome/ChromeTabData'
import { ChromeWindowData } from './model/chrome/ChromeWindowData'
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
    { provide: LocalStorageService, deps: [] },

    {
      provide: AnalyticsIdConfig,
      useValue: analyticsConfiguration,
    },
    {
      provide: AnalyticsService,
      deps: [AnalyticsIdConfig, LocalStorageService],
    },

    { provide: DatabaseService, deps: [NGXLogger, AnalyticsService] },

    { provide: SettingsService, deps: [LocalStorageService] },

    { provide: ChromeTabData, deps: [] },
    { provide: ChromeWindowData, deps: [] },

    { provide: ChromeBadgeView, deps: [] },

    {
      provide: BadgeController,
      deps: [SettingsService, ChromeTabData, ChromeWindowData, ChromeBadgeView],
    },

    {
      provide: DeduplicationService,
      deps: [SettingsService, ChromeTabData, ChromeWindowData],
    },

    {
      provide: TabController,
      deps: [
        NGXLogger,
        AnalyticsService,
        DatabaseService,
        DeduplicationService,
        SettingsService,
        ChromeTabData,
        ChromeWindowData,
        BadgeController,
      ],
    },
  ],
}

const injector = Injector.create(options)
const tabController = injector.get(TabController)
